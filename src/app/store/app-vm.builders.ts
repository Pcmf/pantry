import { Category, Product } from "../models/pantry.models";
import { ProductViewModel } from "../components/product/view-model/product.vm";
import { sortRecordByProp } from "../helpers/order.helper";

export function createPantryListItemViewModel(
  products: Product[],
  categories: Category[],
  searchQuery: string
): Record<string, ProductViewModel> {

  const productModels = createProductModelView(products, categories);

  const filtered =  filterProductsBySearchQuery(productModels, searchQuery);

  const orderedList = sortRecordByProp(filtered, (product) => product.categoryId, 'asc');
  console.log('orderedList', orderedList);

  return orderedList;

//FUNCTIONS

  function createProductModelView(products: Product[], categories: Category[]): ProductViewModel[] {

    const productsMv = products
      .map((product) => ({
        id: crypto.randomUUID(),
        name: product.name,
        quantity: 0,
        expiryDate: new Date(),
        lastUpdated: new Date(),
        categoryId: product.categoryId,
        categoryIcon: categories.find(cat => cat.id === product.categoryId)?.icon || ''
      })
    );

    return productsMv;
  }

  function filterProductsBySearchQuery(products: ProductViewModel[], searchQuery: string): Record<string, ProductViewModel> {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(lowerCaseQuery));

    return Object.fromEntries(filteredProducts.map(product => [product.id, product]));
  }

}

