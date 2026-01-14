import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'pantry', pathMatch: 'full' },
  { path: 'shop', loadComponent: () => import('./pages/shop-list/shop-list.component').then(m => m.ShopListComponent) },
  { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
  { path: 'pantry', loadComponent: () => import('./pages/pantry/pantry.component').then(m => m.PantryComponent) },
  { path: 'edit/:id', loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent) },
  { path: 'new', loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent) },
  { path: '**', redirectTo: 'pantry' }
];
