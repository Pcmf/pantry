import { Category, Product } from "../models/pantry.models";
import { PantryItemViewModel } from "../pages/pantry/view-model/pantry-item.vm";
import { ProductViewModel } from "../components/product/view-model/product.vm";

export function createPantryListItemViewModel(
  products: Product[],
  categories: Category[],
  searchQuery: string
): Record<string, ProductViewModel> {

  const orderedProducts = products.sort((a, b) => a.name.localeCompare(b.name));
  console.log(orderedProducts);


  const productModels = createProductModelView(orderedProducts, categories);

  return filterProductsBySearchQuery(Object.values(productModels), searchQuery);




  function filterProductsBySearchQuery(products: ProductViewModel[], searchQuery: string): Record<string, ProductViewModel> {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(lowerCaseQuery));

    return Object.fromEntries(filteredProducts.map(product => [crypto.randomUUID(), product]));
  }


  function createProductModelView(products: Product[], categories: Category[]): Record<string, ProductViewModel> {
    return Object.fromEntries(
      products.map(product => [product.id, {
        ...product,
        quantity:  0,
        expiryDate: new Date(),
        lastUpdated: new Date(),
        categoryId: product.categoryId,
        categoryIcon: categories.find(cat => cat.id === product.categoryId)?.icon || ''
      }])
    );
  }
}




