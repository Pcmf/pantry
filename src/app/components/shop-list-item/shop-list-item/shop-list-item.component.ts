import { Component, input, output } from '@angular/core';
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
  readonly item = input.required<ShopListViewModel>({});
  readonly checkedItem = output<ShopListViewModel>();





}
