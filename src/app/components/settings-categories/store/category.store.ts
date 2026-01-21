import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Category, initialCategorySlice } from './category.slice';
import { computed, effect, inject } from '@angular/core';
import { PantryService } from '../../../pantry-services/pantry.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

export const CategoryStore = signalStore(
  withState(initialCategorySlice),
  withMethods((store, _api = inject(PantryService)) => ({
    loadCategories: rxMethod<void>(pipe(
      tap(() => patchState(store, { loading: true })),
      switchMap(() => _api.getCategories().pipe(
        tapResponse({
          next: (categories) => {
            patchState(store, {
              loading: false,
              categories,
            });
            console.log(store.categories());
          },
          error: (error) => {
            console.log(error);
            patchState(store, { loading: false })
          }
        })

      )))
    ),
    addCategory(category: Category) {
      patchState(store, (state) => ({
        categories: [...state.categories, category],
      }));
    },

    updateCategory(category: Category) {
      patchState(store, (state) => ({
        categories: state.categories.map((cat) =>
          cat.id === category.id ? category : cat,
        ),
      }));
    },
  })),
  withHooks((store) => ({
    onInit() {
      store.loadCategories();

      const persistedCategories = computed(() => store.categories());
      const categoriesLocalStore = localStorage.getItem('pantry_categories');
      if (categoriesLocalStore) {
        const categories = JSON.parse(categoriesLocalStore);
        patchState(store, { categories });
      }

      effect(() => {
        localStorage.setItem(
          'pantry_categories',
          JSON.stringify(persistedCategories()),
        );
      });
    },
  })),
);
