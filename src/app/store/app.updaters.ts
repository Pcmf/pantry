import { PartialStateUpdater } from '@ngrx/signals';
import { PantrySlice } from './app.slice';
import { ProductViewModel } from '../components/product/view-model/product.vm';

export function setSearchQuery(
  searchQuery: string
): PartialStateUpdater<PantrySlice> {
  return (_) => ({ searchQuery });
}

export function updateProduct(product: ProductViewModel): PartialStateUpdater<PantrySlice> {
  console.log('Updating product:' , product);

  return (state) => ({
    products: { ...state.products,
      [product.id]: product,
    },
  });
}

export function saveProduct(product: ProductViewModel): PartialStateUpdater<PantrySlice> {
  console.log('Saving new product:' , product);

  return (state) => ({
    products: { ...state.products,
      [product.id]: product,
    },
  });
}


