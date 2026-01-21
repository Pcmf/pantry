export interface CategorySlice {
  categories: Category[];
  loading: boolean
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const initialCategorySlice: CategorySlice = {
  categories: [],
  loading: false
}

