import { Component, inject, OnInit } from '@angular/core';
import { AppStore } from '../../../store/app.store';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryStore } from '../../../components/settings-categories/store/category.store';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  providers: [CategoryStore],
  standalone: true,
})
export class ProductFormComponent implements OnInit {
  readonly store = inject(AppStore);
  readonly route = inject(ActivatedRoute);
  readonly catStore = inject(CategoryStore);

  private readonly id = this.route.snapshot.params['id'];
  product = this.store.productsView().find((p) => p.id === this.id) || null;
  public categories = this.catStore.categories();

  ngOnInit() {
    if (!this.route.snapshot.params['id']) {
      //initialize a new product
      this.product = {
        id: crypto.randomUUID(),
        name: '',
        quantity: 0,
        categoryId: this.categories[0].id,
        categoryIcon: this.categories[0].icon,
        expiryDate: undefined,
        lastUpdated: new Date(),
      };
    }
  }

  close() {
    window.history.back();
  }

  save() {
    this.store.addToProductList(this.product!);
    window.history.back();
  }

  remove() {
    throw new Error('Method not implemented.');
  }

  updateCategory(categoryId: string) {
    const icon = this.categories.find((c) => c.id === categoryId)?.icon || '';
    this.product!.categoryIcon = icon;
    this.product!.categoryId = categoryId;
  }
}
