import { create } from 'zustand';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  discount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDiscount: (discount: number) => void;
  clear: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  isEmpty: () => boolean;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discount: 0,
  addItem: (newItem) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.product_id === newItem.product_id
      );
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product_id === newItem.product_id
              ? {
                  ...item,
                  quantity: item.quantity + newItem.quantity,
                  subtotal: (item.quantity + newItem.quantity) * item.price,
                }
              : item
          ),
        };
      }
      return { items: [...state.items, newItem] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product_id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((item) => item.product_id !== productId),
        };
      }
      return {
        items: state.items.map((item) =>
          item.product_id === productId
            ? {
                ...item,
                quantity,
                subtotal: quantity * item.price,
              }
            : item
        ),
      };
    }),
  setDiscount: (discount) => set({ discount }),
  clear: () => set({ items: [], discount: 0 }),
  getSubtotal: () => {
    const state = get();
    return state.items.reduce((sum, item) => sum + item.subtotal, 0);
  },
  getTotal: () => {
    const state = get();
    const subtotal = state.items.reduce((sum, item) => sum + item.subtotal, 0);
    return subtotal - state.discount;
  },
  isEmpty: () => get().items.length === 0,
}));
