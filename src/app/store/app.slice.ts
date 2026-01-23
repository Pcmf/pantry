import { ProductViewModel } from "../components/product/view-model/product.vm";
import { Product } from "../models/pantry.models";

export interface PantrySlice{
  searchQuery: string;
  products: Product[];
  productsView: ProductViewModel[];
}

export const initialPantrySlice: PantrySlice = {
  searchQuery: '',
  products: [],
  productsView: [],
};
