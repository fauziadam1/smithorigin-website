export interface Product {
  id: number;
  name: string;
  price: number;
  discount: number | null;
  imageUrl: string | null;
  categoryId: string;
  isBestSeller: boolean;
  createdAt: string;
  variants: string;
  shopeeUrl?: string | null;
  tokopediaUrl?: string | null;
}