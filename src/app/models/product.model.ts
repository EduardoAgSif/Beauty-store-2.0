export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  image_url?: string;
  rating?: number;
  reviews_count?: number;
  is_featured?: boolean;
}
