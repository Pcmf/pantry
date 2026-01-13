import { Component, input, output } from '@angular/core';
import { ProductViewModel } from '../product/view-model/product.vm';

@Component({
  selector: 'app-quantity-form',
  imports: [],
  templateUrl: './quantity-form.component.html',
  styleUrl: './quantity-form.component.scss',
})
export class QuantityFormComponent {
  readonly quantity = input.required<number>();
  readonly toggle = output<number>();
}
