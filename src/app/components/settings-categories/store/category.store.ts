import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Category, initialCategorySlice } from './category.slice';
// import { CATEGORIES } from "../../../data/categories"
import { computed, effect, inject } from '@angular/core';
import { PantryService } from '../../../pantry-services/pantry.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export const CategoryStore = signalStore(
  withState(initialCategorySlice),
  withProps(() => {
    const _categoryService = inject(PantryService);
    return { categoryService: _categoryService };
  }),

  withMethods((store) => ({

    _loadCategories: rxMethod<void>(pipe(
      switchMap(() => store.categoryService.getCategories().pipe(
        tap((categories) => {
          patchState(store, { categories });
        }),
      )),

    )),

    getCategories() {
      return store.categoryService.getCategories();
    },


    addCategory(category: Category) {
      store.categoryService.addCategory(category).subscribe();
      patchState(store, (state) => ({
        categories: [...state.categories, category],
      }));
    },

    updateCategory(category: Category) {
      store.categoryService.updateCategory(category).subscribe();
      patchState(store, (state) => ({
        categories: state.categories.map((cat) =>
          cat.id === category.id ? category : cat,
        ),
      }));
    },
  })),
  withHooks((store) => ({
    onInit() {
      store._loadCategories();

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
