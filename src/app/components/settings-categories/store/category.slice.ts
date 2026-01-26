export interface CategorySlice {
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const initialCategorySlice: CategorySlice = {
  categories: [],
}

