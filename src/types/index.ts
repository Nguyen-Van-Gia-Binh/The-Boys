export type ProductCategory = "all" | "snack" | "drink" | "flower" | "combo";

export interface ComboGift {
  name: string;
  quantity: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "snack" | "drink" | "flower" | "combo";
  note: string;
  image: string;
  badge?: string;
  color?: string;
  isCombo?: boolean;
  comboGift?: ComboGift;
  options?: {
    sizes?: { name: string; price: number }[];
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: { name: string; price: number };
  unitPrice: number;
}

export interface EarlyBirdVoucher {
  minSpend: number;
  discountPercent: number;
  title: string;
  description: string;
  applicableCategory?: "individual_items" | "all_combos" | "combo_experience";
}

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  note?: string;
  pickupDate: string;
  pickupLocation: string;
  pickupTime: string;
  customPickupTime?: string;
  flowerPickupDate?: string;
  flowerPickupLocation?: string;
  flowerPickupTime?: string;
  flowerCustomPickupTime?: string;
  isMixedOrder?: boolean;
  paymentMethod: "cash" | "bank_transfer";
}

export interface OrderPayload extends OrderFormData {
  id?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    sizeName?: string;
    unitPrice: number;
    subtotal: number;
  }[];
  giftSummary?: string;
  subtotal: number;
  discountAmount: number;
  voucherDescription?: string;
  total: number;
  createdAt: string;
}

export interface OrderResult {
  orderId: string;
  customerName: string;
  phone: string;
  status: string;
  createdAt: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  items?: string;
  total: number;
  paymentMethod: string;
}
