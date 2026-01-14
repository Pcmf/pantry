// import { PartialStateUpdater } from "@ngrx/signals";
// import { Category, CategorySlice } from "./category.slice";

// export function updateCategoryList(category: Category): PartialStateUpdater<CategorySlice> {

//   return (state) => {
//     const categoryIndex = state.categories
//       .findIndex(cat => cat.id === category.id);
//     if (categoryIndex !== -1) {
//       const updatedCategories = [...state.categories];
//       updatedCategories[categoryIndex] = category;
//       return {
//         categories: updatedCategories
//       }
//     }
//     return {
//       categories: [...state.categories, category]
//     }
//   }
// }
