import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { initialPantrySlice, PantrySlice } from "./app.slice";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { forkJoin, pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { computed, inject } from "@angular/core";
import { PantryService } from "../pantry-services/pantry.service";
import { ProductViewModel } from "../models/pantry.models";
import { buildProductsViewModel } from "./app-vm.builders";
import { toEntityMap } from "./app-helper";

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<PantrySlice>(initialPantrySlice),
  withComputed((state) => ({

    productsView: computed(() =>
      buildProductsViewModel(
        Object.values(state.products()),
        Object.values(state.inventory()),
        Object.values(state.categories()),
        state.searchQuery()
      ).sort((a, b) => a.name.localeCompare(b.name))
    ),
  })),
  withMethods((store, _pantryService = inject(PantryService)) => ({

    loadAll: rxMethod<void>(pipe(
      tap(() => patchState(store, { isBusy: true })),
      switchMap(() => forkJoin({
        products: _pantryService.getProducts(),
        inventory: _pantryService.getInventory(),
        categories: _pantryService.getCategories(),
      }).pipe(
        tapResponse({
          next: ({ products, inventory, categories }) => {
            patchState(store, {
              products: toEntityMap(products),
              inventory: toEntityMap(inventory),
              categories: toEntityMap(categories),
              isBusy: false
            });
          },
          error: (error) => {
            patchState(store, { isBusy: false });
            console.log('Error loading data', error);
          }
        })
      )))
    ),
    addToProducts: rxMethod<{ product: ProductViewModel, quantity?: number }>(
      //also add to inventory
      pipe(
        tap(() => patchState(store, { isBusy: true })),
        switchMap(({ product, quantity = 0 }) =>
        forkJoin(
          {
            createdProduct: _pantryService.addProduct(product),
            createdInventory: _pantryService.addInventory({
              id: product.id,
              quantity: quantity,
              expiryDate: product.expiryDate,
              lastUpdated: new Date()
            })
          }).pipe(
            tapResponse({
              next: ({createdProduct, createdInventory}) => {
                patchState(store,
                  {
                    products: {
                      ...store.products(),
                      [createdProduct.id]: createdProduct
                    }
                  }
                );
                patchState(store, {
                  inventory: {
                    ...store.inventory(),
                    [createdInventory.id]: createdInventory
                  }
                });
              },
              error: (error) => console.log('Error adding product', error)
            })
          )
        ),
        tap(() => patchState(store, { isBusy: false })),
      )
    ),
    updateProduct: rxMethod<{product: ProductViewModel, quantity?: number }> (
      //also add to inventory
      pipe(
        tap(() => patchState(store, { isBusy: true })),
        switchMap(({ product, quantity = 0 }) =>
          forkJoin(
            {
              updatedProduct: _pantryService.updateProduct(product, quantity),
              updatedInventory: _pantryService.updateInventory({
                id: product.id,
                quantity: quantity,
                expiryDate: product.expiryDate,
                lastUpdated: new Date()
              })
            }).pipe(
              tapResponse({
                next: ({updatedProduct, updatedInventory}) => patchState(store,
                  { products: { ...store.products(), [updatedProduct.id]: updatedProduct } },
                  { inventory: { ...store.inventory(), [updatedInventory.id]: updatedInventory }}
                ),
                error: (error) => console.log('Error adding product', error)
              })
          )
        ),
        tap(() => patchState(store, { isBusy: false })),
      )
    ),

   addToInventory: rxMethod<{ id: string; quantity: number }>(
      pipe(
        tap(() => patchState(store, { isBusy: true })),
        switchMap(({ id, quantity }) =>
          _pantryService.updateInventory({ id, quantity }).pipe(
            tapResponse({
              next: (inv) => patchState(store, {
                inventory: {
                  ...store.inventory(),
                  [inv.id]: inv
                },
                isBusy: false
              }),
              error: () => patchState(store, { isBusy: false })
            })
          )
        )
      )
    ),
    consumeFromInventory: rxMethod<ProductViewModel>(
      pipe(
        tap(() => patchState(store, { isBusy: true })),
        switchMap((product) =>
          _pantryService.updateInventory({
            id: product.id,
            quantity: Math.max(0, product.quantity - 1),
            expiryDate: product.expiryDate,
            lastUpdated: new Date()
          }).pipe(
            tapResponse({
              next: (product) => patchState(store, { inventory: { ...store.inventory(), [product.id]: product } }),
              error: () => console.log('Error consuming from inventory')
            })
          )
        ),
        tap(d => console.log('after switchMap',d)),

        tap(() => patchState(store, { isBusy: false }))
      )
    ),

    addToShoppingList(product: ProductViewModel) {
      _pantryService.addShopListItem({
        id: product.id,
        quantity: 1,
        checked: false
      }).subscribe();
    },
    markAsBought(id: string) {
      _pantryService.updateShopListItem({  // not correct
        id: id,
        quantity: 0,
        checked: true
      }).subscribe();
    },
    setSearchQuery(query: string) {
      patchState(store, { searchQuery: query });
    },



  })),
  withHooks((store) => ({
      onInit() {
        store.loadAll();
      }
    })
  )
);
