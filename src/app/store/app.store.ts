import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { initialPantrySlice } from "./app.slice";
import { computed, effect, Signal } from "@angular/core";
import { createPantryListItemViewModel } from "./app-vm.builders";
import { PRODUCTS } from "../data/products";
import { CATEGORIES } from "../data/categories";
import * as updaters from "./app.updaters";
import { ProductViewModel } from "../components/product/view-model/product.vm";

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialPantrySlice),
  withMethods(store => ({
    setSearchQuery: (searchQuery: string) => patchState(store, updaters.setSearchQuery(searchQuery)),
    updateProduct: (product: ProductViewModel) => patchState(store, updaters.updateProduct(product)),
    saveProduct: (product: ProductViewModel) => patchState(store, updaters.saveProduct(product)),
  })),
    withHooks(store => ({
      onInit() {
        //initialize products
        const products = computed(() => createPantryListItemViewModel(
          PRODUCTS,
          CATEGORIES,
          store.searchQuery(),
        ));
        patchState(store, { products: products() });

        //create a signal with products to persist to local storage on changes
        const persistedProducts = computed(() => (createPantryListItemViewModel(PRODUCTS, CATEGORIES, store.searchQuery())));

        const productsLocalStore = localStorage.getItem('pantry_products');

        if (productsLocalStore) {
          const products = JSON.parse(productsLocalStore);
          patchState(store, { products });
        }
        //when products change, persist to local storage
        effect(() => {
          const products =Object.values(persistedProducts());
          products.sort((a, b) => a.name.localeCompare(b.name));
          localStorage.setItem('pantry_products', JSON.stringify(products));
        });
      }
  }))
);
