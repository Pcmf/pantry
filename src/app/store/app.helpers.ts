import { PartialStateUpdater } from '@ngrx/signals';
import { ProductViewModel } from '../services/products.service';
import { PantrySlice } from './app.slice';

//wrong implementation because it assumes product IDs are sequential numeric strings
// export function updateProduct(
//   product: ProductViewModel
// ): PartialStateUpdater<PantrySlice> {
//   return (state) => {
//     const products = [ ...state.products ];
//     products[Number(product.id) - 1] = { ...product };
//     return { ...state, products };
//   };
// }
export function updateProduct(
  product: ProductViewModel
): PartialStateUpdater<PantrySlice> {
  return (state) => {
    const index = state.products.findIndex(p => p.id === product.id);
    if (index === -1) return state;

    const products = state.products.slice();
    products[index] = { ...product };

    return { ...state, products };
  };
}


