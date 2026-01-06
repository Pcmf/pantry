import { Component, inject, OnInit } from '@angular/core';
import { AppStore } from '../../store/app.store';
import { ActivatedRoute } from '@angular/router';
import { CATEGORIES } from '../../data/categories';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  private readonly store = inject(AppStore);
  readonly route = inject(ActivatedRoute);

  product = this.store.products().find((p) => p.id === this.route.snapshot.params['id']) || null;
  public categories = CATEGORIES;

  ngOnInit() {
    if (this.route.snapshot.params['id'] === 'new') {
      //initialize a new product
      const newProductId = (this.store.products().length + 1).toString();
      this.product = {
        id: newProductId,
        name: '',
        quantity: 0,
        categoryId: this.categories[0].id,
        categoryIcon: this.categories[0].icon
      };
    }
   }

  close() {
    window.history.back();
  }

  save() {
    this.store.updateProduct(this.product!);
    window.history.back();
  }
  remove() {
    throw new Error('Method not implemented.');
  }

  updateCategory(categoryId: string) {
    const icon = this.categories.find(c => c.id === categoryId)?.icon || '';
    this.product!.categoryIcon = icon;
    this.product!.categoryId = categoryId;
  }
}
