import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { initialPantrySlice } from "./app.slice";
import { computed, effect } from "@angular/core";
import { createPantryListItemViewModel } from "./app-vm.builders";
import { PRODUCTS } from "../data/products";
import { CATEGORIES } from "../data/categories";
import * as updaters from "./app.updaters";
import { ProductViewModel } from "../components/product/view-model/product.vm";
import { updatePantryListItemViewModel } from "./app.updaters";

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialPantrySlice),
  withMethods((store) => ({
    setSearchQuery(searchQuery: string) {
      patchState(store, (state) => ({
        productsView: updatePantryListItemViewModel(state.products, searchQuery),
        searchQuery,
      }));
     },
    updateProductList: (product: ProductViewModel) => patchState(store, updaters.updateProductList(product)),
  })),
    withHooks(store => ({
      onInit() {
        //initialize products
        const products = computed(() => createPantryListItemViewModel(
          PRODUCTS,
          CATEGORIES,
          '',
        ));
        patchState(store, { products: products().sort((a, b) => a.name.localeCompare(b.name)), productsView: products().sort((a, b) => a.name.localeCompare(b.name)) });

        //create a signal with products to persist to local storage on changes()
        const persistedProducts = computed(() => store.products());

        const productsLocalStore = localStorage.getItem('pantry_products');

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
