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
  product.lastUpdated = new Date();
  return (state) => {
      //check if product exists and if so get the index
      const productIndex = state.products.findIndex(p => p.id === product.id);
      if (productIndex !== -1) {
        //update the product
        const updatedProducts = [...state.products];

        updatedProducts[productIndex] = product;

        return {
          products: updatedProducts.sort((a, b) => a.name.localeCompare(b.name)),
          productsView: updatedProducts.sort((a, b) => a.name.localeCompare(b.name))
        };
      }
    //if product doesn't exist, add it
      return {
        products: [...state.products, product].sort((a, b) => a.name.localeCompare(b.name)),
        productsView: [...state.productsView, product].sort((a, b) => a.name.localeCompare(b.name))
      }
    };
  };


export function updatePantryListItemViewModel(
  products: ProductViewModel[],
  searchQuery: string
): ProductViewModel[] {

  const lowerCaseQuery = searchQuery.toLowerCase();
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(lowerCaseQuery));

  return filteredProducts;
}
