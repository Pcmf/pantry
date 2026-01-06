import { patchState, signalStore, withHooks, withMethods, withProps, withState } from "@ngrx/signals";
import { initialPantrySlice } from "./app.slice";
import { computed, effect, inject, Signal } from "@angular/core";
import { ProductsService, ProductViewModel } from "../services/products.service";
import { updateProduct } from "./app.helpers";

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState(initialPantrySlice),
    withProps(_ => ({
      pantryName: 'My Pantry',
      pantryId: '1',
      productsService: inject(ProductsService)
    })),

    withMethods(store => ({
      updateProduct: (product: ProductViewModel) => (
          patchState(store, updateProduct(product))
      )
    })),

    withHooks((store) => ({
      onInit() {
        //initialize products from service
        const products = store.productsService.getProducts();
        patchState(store, { products });
        //create a signal with products to persist to local storage on changes
        const persistedProducts: Signal<ProductViewModel[]> = computed(() => (store.products()));

        const productsLocalStore = localStorage.getItem('pantry_products');
        if (productsLocalStore) {
          const products = JSON.parse(productsLocalStore) as ProductViewModel[];
          patchState(store, { products });
        }
        //when products change, persist to local storage
        effect(() => {
          const products = persistedProducts().sort((a, b) => a.name.localeCompare(b.name));
          localStorage.setItem('pantry_products', JSON.stringify(products));
        });
      }
    }),
  )

)
