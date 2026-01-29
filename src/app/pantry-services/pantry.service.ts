import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Category, Inventory, Product, ShopList } from "../models/pantry.models";
import { delay, Observable } from "rxjs";

export interface EnvironmentType {
  url: string;
}


@Injectable({
  providedIn: 'root'
})
export class PantryService {
  readonly http = inject(HttpClient);

  readonly environment: EnvironmentType = { url: 'http://localhost:3000' };

  // Products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.environment.url}/products`).pipe(delay(2000));
  }

  addProduct(product: Product) {
    return this.http.post<Product>(`${this.environment.url}/products`, product);
  }

  updateProduct(product: Product) {
    return this.http.put<Product>(`${this.environment.url}/products/${product.id}`, product);
  }

  // Inventory
  getInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.environment.url}/inventory`)!;
  }

  addInventory(product: Inventory  ) {
    return this.http.post<Inventory>(`${this.environment.url}/inventory`, product);
  }
  updateInventory(product: Inventory) {
    return this.http.put<Inventory>(`${this.environment.url}/inventory/${product.id}`, product);
  }




  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.environment.url}/categories`)!;
  }

  addCategory(category: Category) {
    return this.http.post(`${this.environment.url}/categories`, category);
  }

  updateCategory(category: Category) {
    return this.http.put(`${this.environment.url}/categories/${category.id}`, category);
  }
//**

/**
 * SHOPLIST
 */
  getShopList(): Observable<ShopList[]> {
    return this.http.get<ShopList[]>(`${this.environment.url}/shoplist`)!;
  }
  addShopListItem(product: ShopList) {
    return this.http.post<ShopList>(`${this.environment.url}/shoplist`, product);
  }
  updateShopListItem(product: ShopList) {
    return this.http.put<ShopList>(`${this.environment.url}/shoplist/${product.id}`, product);
  }

  deleteShopListItem(id: string) {
    return this.http.delete(`${this.environment.url}/shoplist/${id}`);
  }
}
