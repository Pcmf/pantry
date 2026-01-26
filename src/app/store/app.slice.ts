import { Category, Inventory, Product } from "../models/pantry.models";

export interface PantrySlice{
  searchQuery: string;
  products: Record<string, Product>;
  inventory: Record<string, Inventory>;
  categories: Record<string, Category>;
  isBusy: boolean;
}

export const initialPantrySlice: PantrySlice = {
  searchQuery: '',
  products: {},
  inventory: {},
  categories: {},
  isBusy: false,
};
