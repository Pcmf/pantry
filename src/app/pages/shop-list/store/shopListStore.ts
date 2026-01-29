import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { initialShopListSlice } from './shop-list.slice';
import { ShopListViewModel } from './shop-list.vm';
import { PantryService } from '../../../pantry-services/pantry.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { mergeMap, pipe, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { buildShopListViewModel } from './shop-list.builders';
import { AppStore } from '../../../store/app.store';
import { ProductViewModel, ShopList } from '../../../models/pantry.models';


export const ShopListStore = signalStore(
  withState(initialShopListSlice),
  withMethods((store, api = inject(PantryService), appStore = inject(AppStore)) => ({

    loadShopList: rxMethod<void>(pipe(
      switchMap(() => api.getShopList().pipe(
        tapResponse({
          next: (shopList) => patchState(store, { items: buildShopListViewModel(shopList, appStore.productsView()) }),
          error: (error) => console.log('Error loading shop list', error)
        })
      ))
    )),

    addToShopList: rxMethod <ShopListViewModel>(
      pipe(
        switchMap((product) =>
          api.addShopListItem({
            id: product.id,
            quantity: 1,
            checked: false
          }).pipe(
            tapResponse({
              next: () => {
                patchState(store, (state) => ({
                  items: [
                    ...state.items,
                    { ...product, quantity: 1 },
                  ],
                }));
              },
              error: (error) => console.log('Error adding to shop list', error)
            })
          )
      ))
    ),
    update: rxMethod<ShopList>(
      pipe(
        switchMap((product) =>
          api.updateShopListItem(product).pipe(
            tapResponse({
              next: () => {
                patchState(store, (state) => ({
                  items: state.items.map((item) =>
                    item.id === product.id ? { ...item, quantity: product.quantity } : item
                  )
                }))
              },
              error: (error) => console.log('Error updating shop list', error)
            })
          )
        )
      )

    ),

    changeQuantity(
      product: ProductViewModel | ShopListViewModel,
      quantity: number
    ) {
      const alreadyInList = store.items().find((item) => item.id === product.id);

      if (alreadyInList) {
        this.update({
          id: product.id,
          quantity: alreadyInList.quantity + quantity,
          checked: false
        })
      }
      else {
        this.addToShopList(product as ShopListViewModel);
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

    removeFromList: rxMethod<string>(
      pipe(
        mergeMap((productId) =>
          api.deleteShopListItem(productId).pipe(
            tapResponse({
              next: () => {
                patchState(store, (state) => ({
                  items: state.items.filter((item) => item.id !== productId),
                }));
              },
              error: (error) => console.log('Error removing from shop list', error)
            })
          )
        )
      )
    ),

    clearList() {
      patchState(store, () => ({
        items: [],
      }));
    },
  })),
  withHooks((store) => ({
    onInit() {
      store.loadShopList();

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
