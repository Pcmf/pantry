import { Category, Inventory, Product } from "../models/pantry.models";
import { ProductViewModel } from "../components/product/view-model/product.vm";

export function createPantryListItemViewModel(
  products: Product[],
  categories: Category[],
  inventory: Inventory[],
  searchQuery: string
): ProductViewModel[] {

  const productModels = createProductModelView(products, categories, inventory);

  const filtered =  filterProductsBySearchQuery(productModels, searchQuery);

  return filtered;

//FUNCTIONS

  function createProductModelView(products: Product[], categories: Category[], inventory: Inventory[]): ProductViewModel[] {

    const productsMv = products
      .map((product) => {
        const _inventory = inventory.find(inv => inv.id === product.id)!;
        return {
          id: product.id,
          name: product.name,
          quantity: _inventory?.quantity,
          expiryDate: _inventory?.expiryDate ?? undefined,
          lastUpdated: _inventory?.lastUpdated ?? new Date(),
          categoryId: product.categoryId,
          categoryIcon: categories.find(cat => cat.id === product.categoryId)?.icon ?? ''
        }
      }
    );

    return productsMv;
  }

  function filterProductsBySearchQuery(products: ProductViewModel[], searchQuery: string): ProductViewModel[] {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(lowerCaseQuery));

    return filteredProducts;
  }

}

