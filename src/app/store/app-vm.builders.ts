import { Category, Inventory, Product, ProductViewModel } from "../models/pantry.models";

export function buildProductsViewModel(
  products: Product[],
  iventory: Inventory[],
  categories: Category[],
  searchQuery: string
): ProductViewModel[] {
  let filteredProducts = [...products];
  if (searchQuery) {
    filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }
    return filteredProducts.map(product => {
      const inventoryItem = iventory.find(item => item.id === product.id);
      const category = categories.find(cat => cat.id === product.categoryId);

      return {
        id: product.id,
        name: product.name,
        quantity: inventoryItem?.quantity ?? 0,
        expiryDate: inventoryItem?.expiryDate,
        categoryId: product.categoryId,
        categoryIcon: category?.icon ?? '',
        lastUpdated: inventoryItem?.lastUpdated,
      };
  });
}

