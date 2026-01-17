import { Component, inject } from '@angular/core';
import { ShopListItemComponent } from '../../components/shop-list-item/shop-list-item/shop-list-item.component';
import { ShopListStore } from './store/shopListStore';
import { ShopListViewModel } from './store/shop-list.vm';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'app-shop-list',
  imports: [ShopListItemComponent],
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.scss',
  providers: [ShopListStore],
})
export class ShopListComponent {
  readonly shopListStore = inject(ShopListStore);
  readonly appStore = inject(AppStore);

  checkedItem(product: ShopListViewModel) {
    console.log(product);
  }

  toggleQuantity({
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

  toggleAllChecks(value: any) {
    console.log(value);
    this.shopListStore.toggleAllChecked(value);
  }

  done() {
    console.log('done');
    // update the pantry products list with the quantity o shop list
    this.shopListStore.items().map((item) => {
      if (item.checked) {
        const product = this.appStore
          .products()
          .find((product) => product.id === item.id);
        this.appStore.updateProductQuantity(product!, item.quantity);
        this.shopListStore.removeFromList(item.id);
      }
    });

    //clear the shop list
  }
}
