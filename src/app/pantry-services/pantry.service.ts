import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Type } from "@angular/core";
import { ProductViewModel } from "../components/product/view-model/product.vm";
import { Category, Product } from "../models/pantry.models";
import { Observable } from "rxjs";

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

  getPantryProductsList() {
    return this.http.get(`${this.environment.url}/pantry`);
  }



  savePantryProduct(product: ProductViewModel) {
    return this.http.post(`${this.environment.url}/pantry`, product);
  }

}
