import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ShopListStore } from '../store/shopListStore';
import { CommonModule } from '@angular/common';
import { QuantityFormComponent } from '../../quantity-form/quantity-form.component';
import { ShopListViewModel } from '../store/shop-list.vm';

type ToggleQuantity = {
  product: ShopListViewModel;
  quantity: number;
}


@Component({
  selector: 'app-shop-list-item',
  templateUrl: './shop-list-item.component.html',
  styleUrl: './shop-list-item.component.scss',
  providers: [ShopListStore],
  imports: [CommonModule, QuantityFormComponent]
})
export class ShopListItemComponent {
  readonly shopListStore = inject(ShopListStore);

  readonly item = input.required<ShopListViewModel>();
  readonly toggle = output<ToggleQuantity>();
  readonly toggleChecks = output<string>();


  toggleQuantity(quantity: number) {
    this.toggle.emit({product: this.item(), quantity});
  }

}
