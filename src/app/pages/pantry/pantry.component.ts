import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductComponent } from "../../components/product/product.component";
import { AppStore } from '../../store/app.store';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShopListStore } from '../shop-list/store/shopListStore';
import { PantryService } from '../../pantry-services/pantry.service';
import { ProductViewModel } from '../../models/pantry.models';

@Component({
  selector: 'app-pantry',
  imports: [ProductComponent, CommonModule],
  templateUrl: './pantry.component.html',
  styleUrl: './pantry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ShopListStore],

})
export class PantryComponent {
  readonly store = inject(AppStore);
  readonly shopListStore = inject(ShopListStore);
  readonly router = inject(Router);
  readonly pantryService = inject(PantryService);


  onEdit(productId: string) {
    this.router.navigate(['/edit', productId]);
  }

  onTakeOut(product: ProductViewModel) {
    //remove one from Product
    this.store.consumeFromInventory(product, -1);

  }

}
