import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { initialShopListSlice } from './shop-list.slice';
import { ProductViewModel } from '../../../components/product/view-model/product.vm';
import { ShopListViewModel } from './shop-list.vm';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { PantryService } from '../../../pantry-services/pantry.service';

export const ShopListStore = signalStore(
  withState(initialShopListSlice),
  withMethods((store, _api = inject(PantryService)) => ({
    getShopList: rxMethod<void>(pipe(
      switchMap(() => _api.getShopList().pipe(
        tapResponse({
          next: (shopList) => {
            patchState(store, {
              items: shopList,
            })
          },
          error: (error) => {
            console.log(error);
          }
        })
      )
      ))),
    addToShopList: rxMethod<ShopListViewModel>(in$ =>
      in$.pipe(
      pipe(
        switchMap((product) =>
          _api.addShopListItem(product)
        ),
        tap(d => console.log(typeof d)),
        tapResponse({
          next: (product) => {
            patchState(store, state => ({
              items: [...state.items,
                {
                  name: product.name,
                  id: product.id,
                  icon: product.icon,
                  quantity: 1,
                  pantryQuantity: product.quantity,
                  checked: false,
                },
              ]
            }));
          },
          error: err => console.error('Erro ao criar produto', err)
        })
      )
    )),
    changeQuantity(
      product: ShopListViewModel | ProductViewModel,
      quantity: number
    ) {
      const alreadyInList = store.items().find(
        (item) => item.id === product.id
      );
      if (!alreadyInList) {
        this.addToShopList(product as ShopListViewModel);
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
      store.getShopList();

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
