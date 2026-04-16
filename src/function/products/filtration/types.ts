export type ViewMode = 'grid' | 'list';
export type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'newest';

export interface Category {
  _id: string;
  name: string;
}

export interface ProductImage {
  url: string;
  isMain: boolean;
  altText: string;
}

export interface ProductData {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  remains: number;
  images: ProductImage[];
  category?: Category | null;
  type?: { _id: string; name: string } | null;
}


export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  oldPrice: number | null;
  discount: string | null;
  img: string;
  remains: number;
  description?: string;
  category?: Category | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}