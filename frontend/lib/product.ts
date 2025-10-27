export interface Product {
  id: number;
  name: string;
  price: number;
  discount: number | null;
  imageUrl: string | null;
  isBestSeller: boolean;
  createdAt: string;
}