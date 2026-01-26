import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-quantity-form',
  imports: [],
  templateUrl: './quantity-form.component.html',
  styleUrl: './quantity-form.component.scss',
})
export class QuantityFormComponent {
  readonly quantity = input.required<number>();
  readonly disableAll = input<boolean>(false);
  readonly changeQuantity = output<number>();
}
