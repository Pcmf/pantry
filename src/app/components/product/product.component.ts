import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { ProductViewModel } from './view-model/product.vm';
import { diffInDaysFromToday } from '../../helpers/date.helper';

@Component({
  selector: 'app-product',
  imports: [DatePipe, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  readonly product = input.required<ProductViewModel>({});
  readonly edit = output<string>();

  readonly dueDays = linkedSignal(() =>
    diffInDaysFromToday(this.product().expiryDate!)
  )

  deadline = computed(() => {
    const deadlineClass = ['within-deadline', 'expired', 'warning-deadline'];
    if (!this.product().expiryDate) {
      return deadlineClass[0];
    } else {


      if (this.dueDays() <= 0) {
        return deadlineClass[1];
      } else if (this.dueDays() <= 3) {
        return deadlineClass[2];
      } else {
        return deadlineClass[0];
      }
    }
  })
}
