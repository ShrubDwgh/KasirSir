import React from 'react';
import { CartItem } from '@/types';
import { formatCurrency } from '@/utils/formatting';
import { Button } from '@/components/common/Button';

interface CartDisplayProps {
  items: CartItem[];
  discount: number;
  subtotal: number;
  total: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onClearCart: () => void;
  isCheckoutLoading?: boolean;
}

export function CartDisplay({
  items,
  discount,
  subtotal,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onClearCart,
  isCheckoutLoading = false,
}: CartDisplayProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-gray-500 mb-4">🛒 Keranjang kosong</p>
        <p className="text-sm text-gray-400">Tambahkan produk untuk memulai</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((item) => (
          <div key={item.product_id} className="border-b border-gray-200 pb-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">{item.product_name}</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(item.price)} × {item.quantity}
                </p>
              </div>
              <button
                onClick={() => onRemoveItem(item.product_id)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                Hapus
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                className="w-8 h-8 bg-gray-100 rounded text-sm"
              >
                −
              </button>
              <span className="flex-1 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                className="w-8 h-8 bg-gray-100 rounded text-sm"
              >
                +
              </button>
            </div>
            <div className="text-right mt-2 font-bold text-sky-600">
              {formatCurrency(item.subtotal)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Diskon</span>
            <span className="font-semibold text-red-600">
              −{formatCurrency(discount)}
            </span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3 flex justify-between text-lg">
          <span className="font-bold">Total</span>
          <span className="font-bold text-sky-600">{formatCurrency(total)}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            size="lg"
            onClick={onCheckout}
            isLoading={isCheckoutLoading}
            disabled={items.length === 0}
            className="w-full"
          >
            💳 Bayar {formatCurrency(total)}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearCart}
            className="w-full"
          >
            Batal
          </Button>
        </div>
      </div>
    </div>
  );
}
