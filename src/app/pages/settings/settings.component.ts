import { Component } from '@angular/core';
import { Category } from '../../models/pantry.models';
import { inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { AppCategoryFormModalComponent } from '../../components/settings-categories/modal/category-form-modal.component';
import { SettingsCategoriesComponent } from '../../components/settings-categories/settings-categories.component';

@Component({
  selector: 'app-settings',
  imports: [SettingsCategoriesComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
