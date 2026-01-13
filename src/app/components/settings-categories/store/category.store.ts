import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals"
import { Category, initialCategorySlice } from "./category.slice"
import { CATEGORIES } from "../../../data/categories"
import { computed, effect } from "@angular/core"


export const CategoryStore = signalStore(

  withState(initialCategorySlice),

  withMethods((store) => ({

    addCategory(category: Category) {
      patchState(store, (state) => ({
        categories: [...state.categories, category],
      }));
      console.log('Store', store.categories());
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
      patchState(store, { categories: CATEGORIES });

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
