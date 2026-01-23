import { Component, inject, signal } from "@angular/core";
import { Category } from "../../../models/pantry.models";
import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-category-form-modal',
  templateUrl: './category-form-modal.component.html',
  styleUrl: './category-form-modal.component.scss',
  imports: [CommonModule]
})
export class AppCategoryFormModalComponent {
  private dialogRef = inject(DialogRef<Category>)
  readonly data = inject<Category | null>(DIALOG_DATA);
  name = signal(this.data?.name ?? '');
  icon = signal(this.data?.icon ?? '');

  saveCat() {
    this.dialogRef.close({
      id: this.data?.id ?? '',
      name: this.name(),
      icon: this.icon(),
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}


