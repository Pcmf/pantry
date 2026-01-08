import { ProductViewModel } from "../../../components/product/view-model/product.vm";

export interface PantryItemViewModel {
  readonly products: Record<string, ProductViewModel>;
  readonly searchQuery: string;
}
