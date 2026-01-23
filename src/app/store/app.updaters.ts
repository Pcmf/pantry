import { PartialStateUpdater } from '@ngrx/signals';
import { PantrySlice } from './app.slice';
import { ProductViewModel } from '../components/product/view-model/product.vm';

export function setSearchQuery(
  searchQuery: string
): PartialStateUpdater<PantrySlice> {
  return () => ({ searchQuery });
}

export function updateProductList(
  product: ProductViewModel
): PartialStateUpdater<PantrySlice> {
  return (state) => {
      //check if product exists
    if (state.products.find(p => p.id === product.id)) {
      return {
        products: state.products.map(p => p.id === product.id ? { id: product.id, name: product.name, categoryId: product.categoryId } : p),
        productsView: state.productsView.map(p => p.id === product.id ? product : p).sort((a, b) => a.name.localeCompare(b.name)),
      }
    } else {
      return {
        products: [...state.products, { id: product.id, name: product.name, categoryId: product.categoryId }],
        productsView: [...state.productsView, product].sort((a, b) => a.name.localeCompare(b.name)),
      }
    }
  }
};


export function updatePantryListItemViewModel(
  products: ProductViewModel[],
  searchQuery: string
): ProductViewModel[] {

  const lowerCaseQuery = searchQuery.toLowerCase();
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(lowerCaseQuery));

  return filteredProducts;
}
