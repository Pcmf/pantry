import { Component } from '@angular/core';
import { ProductComponent } from "../../components/product/product.component";

@Component({
  selector: 'app-pantry',
  imports: [ProductComponent],
  templateUrl: './pantry.component.html',
  styleUrl: './pantry.component.scss'
})
export class PantryComponent {
  item = {
    id: '1',
    name: 'Milk',
    quantity: 2,
    categoryIcon: '🥛'
  };

  onEdit(productId: string) {
    console.log('Edit product with ID:', productId);
  }
}
