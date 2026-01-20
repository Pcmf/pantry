import { patchState, signalStore, withHooks, withMethods, withProps, withState } from "@ngrx/signals";
import { initialPantrySlice } from "./app.slice";
import { computed, effect, inject } from "@angular/core";
import { createPantryListItemViewModel } from "./app-vm.builders";
import * as updaters from "./app.updaters";
import { ProductViewModel } from "../components/product/view-model/product.vm";
import { updatePantryListItemViewModel } from "./app.updaters";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { forkJoin, map, mergeAll, tap } from "rxjs";
import { PantryService } from "../pantry-services/pantry.service";

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialPantrySlice),
  withProps(_ => { const _pantryService = inject(PantryService); return { pantryService: _pantryService }}),
  withMethods((store) => ({
    //search
    setSearchQuery(searchQuery: string) {
      console.log(searchQuery, store.products());
      patchState(store, (state) => ({
        productsView: updatePantryListItemViewModel(state.products, searchQuery),
        searchQuery,
      }));
    },
    //Product list updates
    updateProductList: (product: ProductViewModel) => patchState(store, updaters.updateProductList(product)),
    //Quantities update
    updateProductQuantity: (productId: string, quantity: number) => (
      patchState(store, (state) => ({
        products: state.products
          .map(p => p.id === productId ? { ...p, quantity: p.quantity + quantity } : p)
      }))
    )
  })),
    withHooks(store => ({
      onInit() {
        //initialize products
        const getProductsApi = rxMethod<void>(input$ => {
          return input$.pipe(
            tap(d => console.log('start', d)),
            map(() => forkJoin({pro: store.pantryService.getProducts(), cat: store.pantryService.getCategories()})),
            mergeAll(),
            tap(({  pro, cat}) => {
              patchState(store,
                {
                  products: createPantryListItemViewModel(pro, cat, '').sort((a, b) => a.name.localeCompare(b.name)),
                  productsView: createPantryListItemViewModel(pro, cat, '').sort((a, b) => a.name.localeCompare(b.name))
                }
              );
            }),
            tap(d => console.log('end', d))
          );

          }
        )
        getProductsApi();


        //create a signal with products to persist to local storage on changes()
        const persistedProducts = computed(() => store.products());

        const productsLocalStore = localStorage.getItem('pantry_products');
        //if exists on localStorage load the appStore with them
        if (productsLocalStore) {
          const products = JSON.parse(productsLocalStore);
          patchState(store, { products, productsView: products});
        }

        //when products change, persist to local storage
        effect(() => {
          localStorage.setItem('pantry_products', JSON.stringify(persistedProducts()));
        });
      }
  }))
);
