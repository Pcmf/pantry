export interface Category {
  id: string;
  name: string;
  icon: string; // e.g. 🥛 🥫 🍝
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
}

export interface Pantry{
  id: string;
  name: string;
}

export interface PantryItem {
  id: string;
  pantryId: string;
  productId: string;
  quantity: number;
  lastUpdated: Date;
}
