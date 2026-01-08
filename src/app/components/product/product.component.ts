import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { ProductViewModel } from './view-model/product.vm';

@Component({
  selector: 'app-product',
  imports: [DatePipe, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  product = input.required<ProductViewModel>();
  @Output() edit = new EventEmitter<string>();
}
