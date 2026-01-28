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

export interface Inventory {
  id: string;
  quantity: number;
  expiryDate?: Date;
  lastUpdated: Date;
}

export interface ShopList {
  id: string;
  quantity: number;
  checked: boolean;
}

export interface ProductViewModel {
  id: string;
  name: string;
  quantity: number;
  expiryDate?: Date;
  categoryId: string;
  categoryIcon: string;
  lastUpdated?: Date;
}
