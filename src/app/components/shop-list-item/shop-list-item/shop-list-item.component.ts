import {
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ShopListStore } from '../../../pages/shop-list/store/shopListStore';
import { QuantityFormComponent } from '../../quantity-form/quantity-form.component';
import { ShopListViewModel } from '../../../pages/shop-list/store/shop-list.vm';

interface ToggleQuantity {
  product: ShopListViewModel;
  quantity: number;
};

@Component({
  selector: 'app-shop-list-item',
  templateUrl: './shop-list-item.component.html',
  styleUrl: './shop-list-item.component.scss',
  providers: [ShopListStore],
  imports: [QuantityFormComponent],
})
export class ShopListItemComponent {
  readonly shopListStore = inject(ShopListStore);

  readonly item = input.required<ShopListViewModel>();
  readonly toggleQty = output<ToggleQuantity>();
  readonly toggleChecks = output<string>();

  toggleQuantity(quantity: number) {
    this.toggleQty.emit({ product: this.item(), quantity });
  }
}
