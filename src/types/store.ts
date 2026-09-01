import { User, Store, Product, Category, Transaction, TransactionItem, Cart } from './index';

export interface AuthState {
  user: User | null;
  store: Store | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setStore: (store: Store | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export interface CartState {
  items: Cart['items'];
  subtotal: number;
  discount: number;
  total: number;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDiscount: (discount: number) => void;
  clear: () => void;
  getTotal: () => number;
}

export interface OfflineState {
  isOnline: boolean;
  syncQueue: any[];
  pendingSyncCount: number;
  setIsOnline: (online: boolean) => void;
  addToSyncQueue: (item: any) => void;
  removeFromSyncQueue: (id: string) => void;
  clearSyncQueue: () => void;
}
