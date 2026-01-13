import { Component, computed, inject, output } from '@angular/core';
import { CATEGORIES } from '../../data/categories';
import { Category } from '../../models/pantry.models';
import { Dialog } from '@angular/cdk/dialog';
import { AppCategoryFormModalComponent } from './modal/category-form-modal.component';
import { CategoryStore } from './store/category.store';

@Component({
  selector: 'app-settings-categories',
  templateUrl: './settings-categories.component.html',
  styleUrl: './settings-categories.component.scss',
  standalone: true,
  imports: [],
  providers: [CategoryStore]
})
export class SettingsCategoriesComponent {
  private dialog = inject(Dialog);

  readonly store = inject(CategoryStore);




  constructor() {
    console.log('Cat store', this.store.categories())
  }

  addCategory() {
    console.log('Add');
    this.openDialog(null);
  }

  editCategory(category: Category) {
    console.log('Edit ', category);
    this.openDialog(category);
  }

  private openDialog(category: Category | null) {
    const ref = this.dialog.open<Category>(AppCategoryFormModalComponent, {
      data: category,
    });

    ref.closed.subscribe((result) => {
      if (!result) return;
      console.log('Result ', result);
      // this.categories = [...this.categories, result];
      this.store.addCategory(result);
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
