export interface ProductViewModel {
  id: string;
  name: string;
  quantity: number;
  categoryId: string;
  categoryIcon: string;
  expiryDate?: Date;
  lastUpdated?: Date;
}
