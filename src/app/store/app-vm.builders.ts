import { Category, Product } from "../models/pantry.models";
import { PantryItemViewModel } from "../pages/pantry/view-model/pantry-item.vm";
import { ProductViewModel } from "../components/product/view-model/product.vm";

export function createPantryListItemViewModel(
  products: Product[],
  categories: Category[],
  searchQuery: string
): Record<string, ProductViewModel> {


  const productModels = createProductModelView(products, categories);

  return filterProductsBySearchQuery(Object.values(productModels), searchQuery);




  function filterProductsBySearchQuery(products: ProductViewModel[], searchQuery: string): Record<string, ProductViewModel> {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(lowerCaseQuery));
    console.log(filteredProducts);

    return Object.fromEntries(filteredProducts.map(product => [product.id, product]));
  }


  function createProductModelView(products: Product[], categories: Category[]): Record<string, ProductViewModel> {
    return Object.fromEntries(
      products.map(product => [product.id, {
        ...product,
        quantity: 0,
        expiryDate: new Date(),
        lastUpdated: new Date(),
        categoryId: product.categoryId,
        categoryIcon: categories.find(cat => cat.id === product.categoryId)?.icon || ''
      }])
    );
  }
}
