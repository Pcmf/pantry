import { PartialStateUpdater } from '@ngrx/signals';
import { PantrySlice } from './app.slice';
import { ProductViewModel } from '../components/product/view-model/product.vm';

export function setSearchQuery(
  searchQuery: string
): PartialStateUpdater<PantrySlice> {
  return (_) => ({ searchQuery });
}

export function updateProductList(
  product: ProductViewModel
): PartialStateUpdater<PantrySlice> {
  console.log('Updating product:', product);

  return (state) => ({
    products: ({ ...state.products, [product.id]: product }),
    productsView: { ...state.productsView, [product.id]: product },
  });
}

export function saveProduct(
  product: ProductViewModel
): PartialStateUpdater<PantrySlice> {
  console.log('Saving new product:', product);

  return (state) => ({
    products: { ...state.products, [product.id]: product },
    productsView: { ...state.productsView, [product.id]: product },
  });
}

export function updatePantryListItemViewModel(
  products: Record<string, ProductViewModel>,
  searchQuery: string
): Record<string, ProductViewModel> {

  const lowerCaseQuery = searchQuery.toLowerCase();
  const filteredProducts = Object.values(products).filter(product => product.name.toLowerCase().includes(lowerCaseQuery));

  return Object.fromEntries(filteredProducts.map(product => [product.id, product]));
}
