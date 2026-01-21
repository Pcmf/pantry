import { ProductViewModel } from "../components/product/view-model/product.vm";

export interface PantrySlice{
  pantryId: string | null;
  pantryName: string | null;
  searchQuery: string;
  products: ProductViewModel[];
  productsView: ProductViewModel[];
  loading: boolean;
}

export const initialPantrySlice: PantrySlice = {
  pantryId: 'my_pantry',
  pantryName: 'My Pantry',
  searchQuery: '',
  products: [],
  productsView: [],
  loading: false,
};
