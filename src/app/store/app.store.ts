import { patchState, signalStore, withHooks, withMethods, withProps, withState } from "@ngrx/signals";
import { initialPantrySlice } from "./app.slice";
import { inject } from "@angular/core";
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
  withProps(() => { const _pantryService = inject(PantryService); return { pantryService: _pantryService }}),
  withMethods((store) => ({
    //search
    setSearchQuery(searchQuery: string) {
      console.log(searchQuery, store.productsView());
      patchState(store, (state) => ({
        productsView: updatePantryListItemViewModel(state.productsView, searchQuery),
        searchQuery,
      }));
    },
    //Product list updates
    addToProductList: (product: ProductViewModel) => {
      const _product = {
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
      };
      if (store.productsView().find(p => p.id === product.id)) {
        store.pantryService.updateProduct(_product, product.quantity).subscribe();
      } else {
        store.pantryService.addProduct(product, product.quantity).subscribe();
      }

      return patchState(store, updaters.updateProductList(product));
    },
    //Quantities update
    updateProductQuantity: (product: ProductViewModel, quantity: number) => {
      const _product = {
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
      };
      store.pantryService.updateProduct(_product, product.quantity + quantity).subscribe();

      return patchState(store, (state) => ({
        productsView: state.productsView
          .map(p => p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p)
      }
    ));
    },
  })
  ),
  withHooks(store => ({
      onInit() {
        //initialize products)
        const getProductsApi = rxMethod<void>(input$ => {
          return input$.pipe(
            map(() => forkJoin({pro: store.pantryService.getProducts(), cat: store.pantryService.getCategories(), inventory: store.pantryService.getInventory()})),
            mergeAll(),
            tap(({ pro, cat, inventory }) => {

              patchState(store,
                {
                  products: pro,
                  productsView: createPantryListItemViewModel(pro, cat, inventory, '').sort((a, b) => a.name.localeCompare(b.name))
                }
              );
            }),
          );

          }
        )
        getProductsApi();

        /**
         * Persistency on localStorage
         */
        //create a signal with products to persist to local storage on changes()
        // const persistedProducts = computed(() => store.products());

        // const productsLocalStore = localStorage.getItem('pantry_products');
        // //if exists on localStorage load the appStore with them
        // if (productsLocalStore) {
        //   const products = JSON.parse(productsLocalStore);
        //   patchState(store, { products, productsView: products});
        // }

        // //when products change, persist to local storage
        // effect(() => {
        //   localStorage.setItem('pantry_products', JSON.stringify(persistedProducts()));
        // });
      }
  }))
);
