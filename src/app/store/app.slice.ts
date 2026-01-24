import { Category, Inventory, Product } from "../models/pantry.models";

export interface PantrySlice{
  searchQuery: string;
  products: Product[];
  inventory: Inventory[];
  categories: Category[];
  isBusy: boolean;
}

export const initialPantrySlice: PantrySlice = {
  searchQuery: '',
  products: [],
  inventory: [],
  categories: [],
  isBusy: false,
};
