// Auth Types
export type UserRole = 'owner' | 'kasir';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  store_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  last_login: string | null;
  created_at: string;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  phone: string;
  logo_url: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

// Product Types
export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: string;
  store_id: string;
  name: string;
  code: string;
  barcode: string | null;
  category_id: string | null;
  purchase_price: number;
  selling_price: number;
  stock: number;
  min_stock: number;
  image_url: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  store_id: string;
  name: string;
  created_at: string;
}

// Transaction Types
export type PaymentMethod = 'cash' | 'qris' | 'card' | 'other';
export type TransactionStatus = 'completed' | 'voided' | 'refunded';

export interface Transaction {
  id: string;
  store_id: string;
  kasir_id: string;
  transaction_number: string;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: PaymentMethod;
  amount_paid: number;
  change: number;
  status: TransactionStatus;
  notes: string | null;
  created_at: string;
  voided_at: string | null;
  voided_by: string | null;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  product_name_snapshot: string;
  product_code: string;
  price_snapshot: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

// Cart Types
export interface CartItem {
  product_id: string;
  product_name: string;
  product_code: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

// Stock Movement Types
export type MovementType = 'purchase' | 'sale' | 'restock' | 'adjustment';

export interface StockMovement {
  id: string;
  store_id: string;
  product_id: string;
  movement_type: MovementType;
  quantity_change: number;
  notes: string | null;
  reference_id: string | null;
  created_by: string;
  created_at: string;
}

// Sync Queue Types
export type SyncAction = 'create' | 'update' | 'delete';
export type SyncStatus = 'pending' | 'synced' | 'failed';

export interface SyncQueueItem {
  id: string;
  store_id: string;
  action: SyncAction;
  table_name: string;
  record_data: Record<string, any>;
  status: SyncStatus;
  error_message: string | null;
  created_at: string;
  synced_at: string | null;
}
