import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Category, Inventory, Product, ShopList } from "../models/pantry.models";
import { Observable } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { ProductViewModel } from "../components/product/view-model/product.vm";

export interface EnvironmentType {
  url: string;
}


@Injectable({
  providedIn: 'root'
})
export class PantryService {
  readonly http = inject(HttpClient);

  readonly environment: EnvironmentType = { url: 'http://localhost:3000' };

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.environment.url}/products`)!;
  }

  addProduct(product: ProductViewModel, quantity = 0) {
    const _product = {
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
    };
    const _expiryDate = product?.expiryDate ?? undefined;
    return this.http.post<Product>(`${this.environment.url}/products`, _product).pipe(
      tapResponse({
        next: (product: Product) => this._addInventory({
          id: product.id,
          quantity: quantity,
          expiryDate: _expiryDate,
          lastUpdated: new Date()
        }).subscribe(),
        error: (error) => console.log('Error adding product', error)
      })
    );
  }

  updateProduct(product: Product, quantity: number) {
    return this.http.put(`${this.environment.url}/products/${product.id}`, product).pipe(
      tapResponse({
        next: () => this._updateInventory({
          id: product.id,
          quantity: quantity,
          lastUpdated: new Date()
        }).subscribe(),
        error: (error) => console.log('Error updating product', error)
      })
    );
  }

  getInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.environment.url}/inventory`)!;
  }

  _addInventory(product: Inventory  ) {
    return this.http.post(`${this.environment.url}/inventory`, product);
  }
  _updateInventory(product: Inventory) {
    return this.http.put(`${this.environment.url}/inventory/${product.id}`, product);
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
  /**
   * END SHOPLIST
   */



}
