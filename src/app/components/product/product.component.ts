import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { ProductViewModel } from './view-model/product.vm';
import { diffInDaysFromToday } from '../../helpers/date.helper';
import { QuantityFormComponent } from '../quantity-form/quantity-form.component';
import { AppStore } from '../../store/app.store';
import { AppCategoryFormModalComponent } from "../settings-categories/modal/category-form-modal.component";

@Component({
  selector: 'app-product',
  imports: [DatePipe, CommonModule, QuantityFormComponent, AppCategoryFormModalComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  readonly product = input.required<ProductViewModel>({});
  readonly edit = output<string>();
  readonly prodStore = inject(AppStore);

  readonly dueDays = linkedSignal(() =>
    diffInDaysFromToday(this.product().expiryDate!)
  );

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
    this.product().quantity += quantity;
    this.prodStore.updateProductList(this.product());
  }
}
