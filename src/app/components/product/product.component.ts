import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { ProductViewModel } from './view-model/product.vm';
import { diffInDaysFromToday } from '../../helpers/date.helper';
import { QuantityFormComponent } from '../quantity-form/quantity-form.component';
import { AppStore } from '../../store/app.store';
import { ShopListStore } from '../shop-list-item/store/shopListStore';

@Component({
  selector: 'app-product',
  imports: [DatePipe, CommonModule, QuantityFormComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ShopListStore],
})
export class ProductComponent {
  readonly product = input.required<ProductViewModel>({});
  readonly edit = output<string>();
  readonly prodStore = inject(AppStore);
  readonly shopListStore = inject(ShopListStore);

  readonly dueDays = computed(() =>
    diffInDaysFromToday(this.product().expiryDate!)
  );

  readonly cartQuantity = computed(() => this.shopListStore.items().find(item => item.id === this.product().id)?.quantity ?? 0);
  readonly isInCart = computed(() => this.shopListStore.items().find(item => item.id === this.product().id) !== undefined);



  deadline = computed(() => {
    const deadlineClass = [
      '',
      'within-deadline',
      'expired',
      'warning-deadline',
    ];
    if (!this.product().expiryDate) {
      return deadlineClass[0];
    } else {
      if (this.dueDays() <= 0) {
        return deadlineClass[2];
      } else if (this.dueDays() <= 3) {
        return deadlineClass[3];
      } else {
        return deadlineClass[1];
      }
    }
  });

  toggle(quantity: number) {
    console.log(quantity);
    if(!this.isInCart()){
      this.shopListStore.addToProductList(this.product());
    } else {
      this.shopListStore.changeQuantity(this.product(), quantity);
    }


  }

}
