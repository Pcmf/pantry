import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, effect } from "@angular/core";
import { initialShopListSlice } from "./shop-list.slice";
import { ProductViewModel } from "../../product/view-model/product.vm";
import { ShopListViewModel } from "./shop-list.vm";

export const ShopListStore = signalStore(
  withState(initialShopListSlice),
  withMethods((store) => ({
    addToProductList(product: ProductViewModel) {
      console.log('add');
      patchState(store, (state) => ({
        items: [...state.items, { name: product.name, id: product.id, icon: product.categoryIcon, quantity: 1, pantryQuantity: product.quantity}]
      }))
     },
    changeQuantity(product: ProductViewModel | ShopListViewModel, quantity: number) {
      console.log('change ', product, quantity);
      patchState(store, (state) => ({
        items: state.items.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }))
     },
    removeFromList(productId: string) {
      patchState(store, (state) => ({
        items: state.items.filter(item => item.id !== productId)
      }))
     },
    clearList() {
      patchState(store, (state) => ({
        items: []
      }))
     }
  })),
  withHooks(store => ({
    onInit() {
      const persistedShopList = computed(() => store.items());

      const shopListLocalStore = localStorage.getItem('pantry_shop_list');
      if (shopListLocalStore) {
        const shopList = JSON.parse(shopListLocalStore);
        patchState(store, { items: shopList });
      }

      effect(() => {
        localStorage.setItem('pantry_shop_list', JSON.stringify(persistedShopList()));
      });

    }
  }))

)
