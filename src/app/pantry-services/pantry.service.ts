import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Type } from "@angular/core";
import { ProductViewModel } from "../components/product/view-model/product.vm";

export type EnvironmentType = {
  url: string;
}



@Injectable({
  providedIn: 'root'
})
export class PantryService {
  readonly http = inject(HttpClient);

  readonly environment: EnvironmentType = { url: 'http://localhost:3000' };

  getProducts() {
    return this.http.get(`${this.environment.url}/products`);
  }

  getCategories() {
    return this.http.get(`${this.environment.url}/categories`);
  }

  getPantryProductsList() {
    return this.http.get(`${this.environment.url}/pantry`);
  }



  savePantryProduct(product: ProductViewModel) {
    return this.http.post(`${this.environment.url}/pantry`, product);
  }

}
