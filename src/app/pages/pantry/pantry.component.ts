import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductComponent } from "../../components/product/product.component";
import { AppStore } from '../../store/app.store';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pantry',
  imports: [ProductComponent, CommonModule],
  templateUrl: './pantry.component.html',
  styleUrl: './pantry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PantryComponent {
  readonly store = inject(AppStore);
  readonly router = inject(Router);


  onEdit(productId: string) {
    this.router.navigate(['/edit', productId]);
  }

}
