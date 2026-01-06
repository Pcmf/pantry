import { ProductViewModel } from "../services/products.service";

export interface PantrySlice{
  pantryId: string | null;
  pantryName: string | null;
  products: ProductViewModel[];
}

export const initialPantrySlice: PantrySlice = {
  pantryId: 'my_pantry',
  pantryName: 'My Pantry',
  products: []
};
