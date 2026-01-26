import { Component } from '@angular/core';
import { SettingsCategoriesComponent } from '../../components/settings-categories/settings-categories.component';

@Component({
  selector: 'app-settings',
  imports: [SettingsCategoriesComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
