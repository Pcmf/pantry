import { ShopList, ProductViewModel } from "../../../models/pantry.models";
import { ShopListViewModel } from "./shop-list.vm";

export function buildShopListViewModel(shopList: ShopList[], products: ProductViewModel[]) {
  return shopList.map((shopListItem) => {
    const product = products.find(product => product.id === shopListItem.id)!;
    const item: ShopListViewModel = {
      name: product.name,
      id: product.id,
      icon: product?.categoryIcon ?? '',
      quantity: shopListItem.quantity,
      pantryQuantity: product.quantity,
      checked: shopListItem.checked,
    }
    return item;
  })
}
