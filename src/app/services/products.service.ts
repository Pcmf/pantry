import { Injectable } from "@angular/core";
import { PRODUCTS } from "../data/products";
import { CATEGORIES } from "../data/categories";

export interface ProductViewModel {
  id: string;
  name: string;
  quantity: number;
  categoryId: string;
  categoryIcon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  readonly products = PRODUCTS;
  readonly categories = CATEGORIES;
  productViewModels: ProductViewModel[] = [];

  getProducts(): ProductViewModel[] {

    const products = this.products.map(product => {
    const category = this.categories.find(cat => cat.id === product.categoryId);
      return {
        id: product.id,
        name: product.name,
        quantity: 0,
        categoryId: category ? category.id : '',
        categoryIcon: category ? category.icon : ''
      }
    });
    return products;
  }
}


