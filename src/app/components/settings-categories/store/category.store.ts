import { patchState, signalStore, withHooks, withMethods, withProps, withState } from "@ngrx/signals"
import { Category, initialCategorySlice } from "./category.slice"
// import { CATEGORIES } from "../../../data/categories"
import { computed, effect, inject } from "@angular/core"
import { PantryService } from "../../../pantry-services/pantry.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { map, switchAll, tap } from "rxjs";


export const CategoryStore = signalStore(

  withState(initialCategorySlice),
  withProps(_ => { const _categoryService = inject(PantryService); return { categoryService: _categoryService }),

  withMethods((store) => ({

    addCategory(category: Category) {
      patchState(store, (state) => ({
        categories: [...state.categories, category],
      }));
    },

    updateCategory(category: Category) {
      //   store.categories(list => list.map(cat => cat.id === category.id ? category : cat));
      patchState(store, (state) => ({
        categories: state.categories.map(cat => cat.id === category.id ? category : cat),
      }))
    }

  })),
  withHooks(store => ({
    onInit() {
      const categories = rxMethod<void>(input$ => {
        return input$.pipe(
          map(() => store.categoryService.getCategories()),
          switchAll(),
          tap((categories: Category[]) => {
            patchState(store, { categories });
          }
        ))
      })

      categories();

      const persistedCategories = computed(() => store.categories());
      const categoriesLocalStore = localStorage.getItem('pantry_categories');
      if (categoriesLocalStore) {
        const categories = JSON.parse(categoriesLocalStore);
        patchState(store, { categories });
      }

      effect(() => {
        localStorage.setItem('pantry_categories', JSON.stringify(persistedCategories()));
      });
    }
  }))
)
