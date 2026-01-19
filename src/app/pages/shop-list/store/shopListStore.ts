import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, effect } from '@angular/core';
import { initialShopListSlice } from './shop-list.slice';
import { ProductViewModel } from '../../../components/product/view-model/product.vm';
import { ShopListViewModel } from './shop-list.vm';

export const ShopListStore = signalStore(
  withState(initialShopListSlice),
  withMethods((store) => ({

    addToProductList(product: ProductViewModel) {
      patchState(store, (state) => ({
        items: [
          ...state.items,
          {
            name: product.name,
            id: product.id,
            icon: product.categoryIcon,
            quantity: 1,
            pantryQuantity: product.quantity,
            checked: false,
          },
        ],
      }));
    },
    changeQuantity(
      product: ProductViewModel | ShopListViewModel,
      quantity: number
    ) {
      const alreadyInList = store.items().find(
        (item) => item.id === product.id
      );
      if (!alreadyInList) {
        this.addToProductList(product as ProductViewModel);
      }
      else {
      patchState(store, (state) => ({
        items: state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      }));
    }
    },
    toggleChecked(id: string) {
      patchState(store, (state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        ),
      }));
    },
    toggleAllChecked(value: boolean) {
      patchState(store, (state) => ({
        items: state.items.map((item) => ({ ...item, checked: value })),
      }));
    },
    removeFromList(productId: string) {
      patchState(store, (state) => ({
        items: state.items.filter((item) => item.id !== productId),
      }));
    },
    clearList() {
      patchState(store, (state) => ({
        items: [],
      }));
    },
  })),
  withHooks((store) => ({
    onInit() {
      const persistedShopList = computed(() => store.items());
      const shopListLocalStore = localStorage.getItem('pantry_shop_list');
      if (shopListLocalStore) {
        const shopList = JSON.parse(shopListLocalStore);
        patchState(store, { items: shopList });
      }

      effect(() => {
        localStorage.setItem(
          'pantry_shop_list',
          JSON.stringify(persistedShopList())
        );
      });
    },
  }))
);
