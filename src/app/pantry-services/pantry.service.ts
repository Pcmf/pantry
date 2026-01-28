import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Category, Inventory, Product, ProductViewModel, ShopList } from "../models/pantry.models";
import { Observable } from "rxjs";
import { tapResponse } from "@ngrx/operators";

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

  addProduct(product: Product) {
    const _product = {
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
    };
    // const _expiryDate = product?.expiryDate ?? undefined;
    return this.http.post<Product>(`${this.environment.url}/products`, _product);
      // tapResponse({
      //   next: (product: Product) => this.addInventory({
      //     id: product.id,
      //     quantity: quantity,
      //     expiryDate: _expiryDate,
      //     lastUpdated: new Date()
      //   }).subscribe(),
      //   error: (error) => console.log('Error adding product', error)
      // })
    // );
  }

  updateProduct(product: ProductViewModel, quantity: number) {
    const _product = {
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
    };
    return this.http.put<Product>(`${this.environment.url}/products/${_product.id}`, _product).pipe(
      tapResponse({
        next: () => this.updateInventory({
          id: product.id,
          quantity: product.quantity + quantity,
          expiryDate: product.expiryDate,
          lastUpdated: new Date()
        }).subscribe(),
        error: (error) => console.log('Error updating product', error)
      })
    );
  }

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
  /**
   * END SHOPLIST
   */



}
