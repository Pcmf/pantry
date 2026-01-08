import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { initialPantrySlice } from "./app.slice";
import { computed, effect } from "@angular/core";
import { createPantryListItemViewModel } from "./app-vm.builders";
import { PRODUCTS } from "../data/products";
import { CATEGORIES } from "../data/categories";
import * as updaters from "./app.updaters";
import { ProductViewModel } from "../components/product/view-model/product.vm";

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialPantrySlice),
  withComputed((store) => ({
    products: computed(() => createPantryListItemViewModel(
      PRODUCTS,
      CATEGORIES,
      store.searchQuery(),
    )),
  })),
  withMethods(store => ({
    setSearchQuery: (searchQuery: string) => patchState(store, updaters.setSearchQuery(searchQuery)),
    updateProduct: (product: ProductViewModel) => patchState(store, updaters.updateProduct(product)),
    saveProduct: (product: ProductViewModel) => patchState(store, updaters.saveProduct(product)),
  })),
    withHooks(store => ({
      onInit() {
        const persist = computed(() => store.products());
        const storeInLoalStorage = localStorage.getItem('appStore');
        if (storeInLoalStorage) {
          const parsedStore = JSON.parse(storeInLoalStorage);
          patchState(store, parsedStore);
        }
        effect(() => {
          localStorage.setItem('appStore', JSON.stringify(persist()));
        });

    }
  }))
);
