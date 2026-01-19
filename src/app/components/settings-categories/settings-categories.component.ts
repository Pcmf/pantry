import { Component, inject } from '@angular/core';
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

  addCategory() {
    this.openDialog(null);
  }

  editCategory(category: Category) {
    this.openDialog(category);
  }

  // Modal
  private openDialog(category: Category | null) {
    const ref = this.dialog.open<Category>(AppCategoryFormModalComponent, {
      data: category,
    });

    ref.closed.subscribe((result) => {
      if (!result) return;
      this.store.addCategory(result);
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
