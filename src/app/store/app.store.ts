import { patchState, signalStore, withHooks, withMethods, withProps, withState } from "@ngrx/signals";
import { initialPantrySlice } from "./app.slice";
import { computed, effect, inject } from "@angular/core";
import { createPantryListItemViewModel } from "./app-vm.builders";
import * as updaters from "./app.updaters";
import { ProductViewModel } from "../components/product/view-model/product.vm";
import { updatePantryListItemViewModel } from "./app.updaters";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { forkJoin, pipe, switchMap, tap } from "rxjs";
import { PantryService } from "../pantry-services/pantry.service";
import { Category } from "../models/pantry.models";
import { tapResponse } from "@ngrx/operators";


export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialPantrySlice),
  withMethods((store, _api = inject(PantryService)) => ({

    _loadProducts: rxMethod<void>(pipe(
      tap(() => patchState(store, { loading: true })),
      switchMap(() =>
      forkJoin({
        products: _api.getProducts(),
        categories: _api.getCategories()
      }).pipe(
        tapResponse({
          next: ({ products, categories }) => {
            patchState(store, {
              loading: false,
              products: createPantryListItemViewModel(products, categories, '').sort((a, b) => a.name.localeCompare(b.name)),
              productsView: createPantryListItemViewModel(products, categories, '').sort((a, b) => a.name.localeCompare(b.name))
            });
            // const result = _api.addProductsViewModel(store.productsView()).subscribe();
            // console.log(result);
          },
          error: (error) => {
            console.log(error);
            patchState(store, { loading: false })
          }
        })
      ))
    )),
    // _save: rxMethod<ProductViewModel>(pipe(
    //   tap(() => patchState(store, { loading: true })),
    //   switchMap((product) => _api.addProductViewModel(product)),
    //   tapResponse({
    //     next: () => {
    //       patchState(store, { loading: false })
    //     },
    //     error: (error) => {
    //       console.log(error);
    //       patchState(store, { loading: false })
    //     }
    //   })
    // )),
   //search
    setSearchQuery(searchQuery: string) {
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
      if (store.products().length === 0) {
        console.log('onInit',store.products())
        store._loadProducts();
      }
    }
  })
  )
)
