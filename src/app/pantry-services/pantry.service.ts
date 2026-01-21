import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Type } from "@angular/core";
import { ProductViewModel } from "../components/product/view-model/product.vm";
import { Category, Product } from "../models/pantry.models";
import { Observable } from "rxjs";
import { ShopListViewModel } from "../pages/shop-list/store/shop-list.vm";

export type EnvironmentType = {
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

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.environment.url}/categories`)!;
  }

  addProduct(product: Product) {
    return this.http.post<Product[]>(`${this.environment.url}/products`, product);
  }

  //PRODUCT View Model
    addProductsViewModel(products: ProductViewModel[]) {
    console.log('Save all',products);
    return this.http.post<ProductViewModel[]>(`${this.environment.url}/pantry-products`, products);
  }

  addProductViewModel(product: ProductViewModel) {
    console.log('Save',product);
    return this.http.post<ProductViewModel[]>(`${this.environment.url}/pantry-products`, product);
  }

  updateProduct(product: ProductViewModel) {
    return this.http.put(`${this.environment.url}/pantry/${product.id}`, product);
  }

  getShopList() {
    return this.http.get<ShopListViewModel[]>(`${this.environment.url}/pantry-shop-list`);
  }

  addShopListItem(item: ShopListViewModel): Observable<ShopListViewModel> {
    return this.http.post<ShopListViewModel>(`${this.environment.url}/pantry-shop-list`, item);
  }



}
