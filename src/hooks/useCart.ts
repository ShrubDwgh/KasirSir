import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import { useCallback } from 'react';

export function useCart() {
  const {
    items,
    discount,
    addItem,
    removeItem,
    updateQuantity,
    setDiscount,
    clear,
    getSubtotal,
    getTotal,
    isEmpty,
  } = useCartStore();

  const handleAddProduct = useCallback(
    (product: Product, quantity: number = 1) => {
      if (product.stock < quantity) {
        throw new Error('Stok tidak mencukupi');
      }

      addItem({
        product_id: product.id,
        product_name: product.name,
        product_code: product.code,
        price: product.selling_price,
        quantity,
        subtotal: product.selling_price * quantity,
      });
    },
    [addItem]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity]
  );

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      removeItem(productId);
    },
    [removeItem]
  );

  const handleSetDiscount = useCallback(
    (value: number) => {
      setDiscount(Math.max(0, value));
    },
    [setDiscount]
  );

  const handleClear = useCallback(() => {
    clear();
  }, [clear]);

  return {
    items,
    discount,
    subtotal: getSubtotal(),
    total: getTotal(),
    addProduct: handleAddProduct,
    updateQuantity: handleUpdateQuantity,
    removeProduct: handleRemoveProduct,
    setDiscount: handleSetDiscount,
    clear: handleClear,
    isEmpty: isEmpty(),
  };
}
