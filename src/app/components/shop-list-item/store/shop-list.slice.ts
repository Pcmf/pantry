import { ShopListViewModel } from "./shop-list.vm";


export interface ShopListItem {
  productId: string;
  quantity: number;
}

export interface ShopListSlice {
  items: ShopListViewModel[];
}

export const initialShopListSlice: ShopListSlice = {
  items: [],
};






