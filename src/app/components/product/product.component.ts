import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ProductItemView {
  id: string;
  name: string;
  quantity: number;
  categoryIcon: string; // e.g. 🥛 🥫 🍝
}

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
@Input({ required: true }) item!: ProductItemView;
  @Output() edit = new EventEmitter<string>();
}
