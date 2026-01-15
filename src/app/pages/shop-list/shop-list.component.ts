import { Component, inject } from '@angular/core';
import { ShopListItemComponent } from "../../components/shop-list-item/shop-list-item/shop-list-item.component";
import { ShopListStore } from '../../components/shop-list-item/store/shopListStore';
import { ShopListViewModel } from '../../components/shop-list-item/store/shop-list.vm';

@Component({
  selector: 'app-shop-list',
  imports: [ShopListItemComponent],
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.scss',
  providers: [ShopListStore]
})
export class ShopListComponent {
  readonly shopListStore = inject(ShopListStore);

  checkedItem(product: ShopListViewModel) {
    console.log(product);
  }

  done() {
    console.log('done');
  }
}
