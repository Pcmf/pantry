import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ShopListStore } from '../store/shopListStore';
import { CommonModule } from '@angular/common';
import { QuantityFormComponent } from '../../quantity-form/quantity-form.component';
import { ShopListViewModel } from '../store/shop-list.vm';

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


  disableAll = false;

  toggleQuantity(quantity: number) {
    this.shopListStore.changeQuantity(this.item(), quantity);
  }

  checkItem(product: ShopListViewModel) {
    this.disableAll = !this.disableAll;
    console.log(product);
  }

}
