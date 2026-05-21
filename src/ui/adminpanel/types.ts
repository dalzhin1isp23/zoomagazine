export interface AdminProduct {
  _id: string;
  name: string;
  description?: string;
  manufacturer?: string;
  price: number;
  type?: {
    _id: string;
    name: string;
  };
  remains?: number;
  discount?: number;
  images?: Array<{
    url: string;
    isMain?: boolean;
    altText?: string;
  }>;
  category?: {
    _id: string;
    name: string;
  };
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}


export type AdminTab = 'dashboard' | 'products' | 'clients' | 'settings';

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    discount?: number;
    remains: number;
    images?: Array<{ url: string; isMain?: boolean; altText?: string }>;
    category?: { _id: string; name: string };
    type?: { _id: string; name: string };
  };
  quantity: number;
  addedAt: string;
}

export interface CartState {
  items: CartItem[];
  updatedAt: string;
}