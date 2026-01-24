import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { initialPantrySlice, PantrySlice } from "./app.slice";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { forkJoin, pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { computed, inject } from "@angular/core";
import { PantryService } from "../pantry-services/pantry.service";
import { Inventory, ProductViewModel } from "../models/pantry.models";
import { buildProductsViewModel } from "./app-vm.builders";

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<PantrySlice>(initialPantrySlice),
  withComputed((state) => ({

    productsView: computed(() =>
      buildProductsViewModel(
        state.products(),
        state.inventory(),
        state.categories(),
        state.searchQuery()
      ).sort((a, b) => a.name.localeCompare(b.name))
    ),
    productsMap: computed(() => Object.fromEntries(state.products().map(p => [p.id, p]))),
    inventoryMap: computed(() => Object.fromEntries(state.inventory().map(i => [i.id, i]))),
    categoriesMap: computed(() => Object.fromEntries(state.categories().map(c => [c.id, c]))),
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
            patchState(store, { products, inventory, categories, isBusy: false });
          },
          error: (error) => {
            patchState(store, { isBusy: false });
            console.log('Error loading data', error);
          }
        })
      )))
    ),
    addToProducts: rxMethod<{product: ProductViewModel, quantity?: number }> (
      //also add to inventory
      pipe(
        tap(() => patchState(store, { isBusy: true })),
        switchMap(({ product, quantity = 0 }) =>
          _pantryService.addProduct(product, quantity).pipe(
            tapResponse({
              next: (product) => patchState(store,
                { products: [...store.products(), product] },
                { inventory: [...store.inventory(), { ...product, quantity: quantity }] }
              ),
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
          _pantryService.updateProduct(product, quantity).pipe(
            tapResponse({
              next: (product) => patchState(store,
                { products: [...store.products().map(p => p.id === product.id ? product : p)] },
                { inventory: [...store.inventory().map(p => p.id === product.id ? {...p, quantity: quantity} : p)] }
              ),
              error: (error) => console.log('Error adding product', error)
            })
          )
        ),
        tap(() => patchState(store, { isBusy: false })),
      )
    ),

    addToInventory(product: ProductViewModel, quantity: number) {
      const _product: Inventory = {
        id:product.id,
        quantity: product.quantity + quantity,
        expiryDate: product.expiryDate,
        lastUpdated: new Date()
      };
      _pantryService.updateInventory(_product).pipe(
        tapResponse({
          next: (product) => patchState(store, { inventory: [...store.inventory(), product] }),
          error: (error) => console.log('Error adding product', error)

        })
      ).subscribe();
    },
    consumeFromInventory(product: ProductViewModel, quantity: number) {
      const _product = {
        id: product.id,
        quantity: product.quantity + quantity,
        expiryDate: product.expiryDate,
        lastUpdated: new Date()
      };
      _pantryService.updateInventory(_product).subscribe();
      patchState(store, { inventory: store.inventory().map(item => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: item.quantity + quantity
          }
        }
        return item;
      })})
    },
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
