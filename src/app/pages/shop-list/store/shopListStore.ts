import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { initialShopListSlice } from './shop-list.slice';
import { ProductViewModel } from '../../../components/product/view-model/product.vm';
import { ShopListViewModel } from './shop-list.vm';
import { PantryService } from '../../../pantry-services/pantry.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { buildShopListViewModel } from './shop-list.builders';
import { AppStore } from '../../../store/app.store';


export const ShopListStore = signalStore(
  withState(initialShopListSlice),
  withMethods((store, api = inject(PantryService), appStore = inject(AppStore)) => ({

    _loadShopList: rxMethod<void>(pipe(
      switchMap(() => api.getShopList().pipe(
        tap(data => console.log(data)),
        tapResponse({
          next: (shopList) => patchState(store, { items: buildShopListViewModel(shopList, appStore.productsView()) }),
          error: (error) => console.log('Error loading shop list', error)
        })
      ))
    )),


    addToProductList(product: ProductViewModel) {
      api.addShopListItem({
        id: product.id,
        quantity: 1,
        checked: false
      }).subscribe();
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
      const alreadyInList = store.items().find((item) => item.id === product.id);
      if (!alreadyInList) {
        this.addToProductList(product as ProductViewModel);
      }
      else {
      api.updateShopListItem({
        id: product.id,
        quantity: alreadyInList.quantity + quantity,
        checked: false
      }).subscribe();
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
      api.deleteShopListItem(productId).subscribe();
      patchState(store, (state) => ({
        items: state.items.filter((item) => item.id !== productId),
      }));
    },
    clearList() {
      patchState(store, () => ({
        items: [],
      }));
    },
  })),
  withHooks((store) => ({
    onInit() {
      store._loadShopList();

      // const persistedShopList = computed(() => store.items());
      // const shopListLocalStore = localStorage.getItem('pantry_shop_list');
      // if (shopListLocalStore) {
      //   const shopList = JSON.parse(shopListLocalStore);
      //   patchState(store, { items: shopList });
      // }

      // effect(() => {
      //   localStorage.setItem(
      //     'pantry_shop_list',
      //     JSON.stringify(persistedShopList())
      //   );
      // });
    },
  }))
);
