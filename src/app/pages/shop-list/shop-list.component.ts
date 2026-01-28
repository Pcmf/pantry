import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ShopListItemComponent } from '../../components/shop-list-item/shop-list-item/shop-list-item.component';
import { ShopListStore } from './store/shopListStore';
import { ShopListViewModel } from './store/shop-list.vm';
import { AppStore } from '../../store/app.store';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shop-list',
  imports: [ShopListItemComponent],
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ShopListStore],
})
export class ShopListComponent {
  readonly shopListStore = inject(ShopListStore);
  readonly appStore = inject(AppStore);
  readonly location = inject(Location);



  changeQuantity({
    product,
    quantity,
  }: {
    product: ShopListViewModel;
    quantity: number;
  }) {
    this.shopListStore.changeQuantity(product, quantity);
  }

  toggleChecks(id: string) {
    this.shopListStore.toggleChecked(id);
  }

  toggleAllChecks(value: boolean) {
    this.shopListStore.toggleAllChecked(value);
  }

  done() {
    // update the pantry products list with the quantity on shop list
    this.shopListStore.items().map((item) => {
      if (item.checked) {
        const product = this.appStore
          .productsView()
          .find((product) => product.id === item.id)!;
        this.appStore.addToInventory(
          {product,
          quantity: item.quantity}
        );
        this.shopListStore.removeFromList(item.id);
      }
    });
    this.location.back();
  }
}
