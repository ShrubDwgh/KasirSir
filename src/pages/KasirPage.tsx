import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useAsync } from '@/hooks/useAsync';
import { getProducts, searchProducts } from '@/services/products';
import { createTransaction } from '@/services/transactions';
import { Layout } from '@/components/layout';
import { ProductSearch } from '@/components/kasir/ProductSearch';
import { CartDisplay } from '@/components/kasir/CartDisplay';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Product, Transaction } from '@/types';
import { formatCurrency, generateTransactionNumber } from '@/utils/formatting';

type PaymentMethod = 'cash' | 'qris' | 'card' | 'other';

export function KasirPage() {
  const { user, store } = useAuth();
  const { items, total, discount, addProduct, removeProduct, updateQuantity, setDiscount, clear } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaid, setAmountPaid] = useState(0);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);

  const { data: allProducts, loading: productsLoading, execute: loadProducts } = useAsync(
    () => store ? getProducts(store.id) : Promise.resolve([])
  );

  useEffect(() => {
    if (store && allProducts) {
      setProducts(allProducts);
    }
  }, [allProducts, store]);

  useEffect(() => {
    if (store) {
      loadProducts();
    }
  }, [store]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowPaymentModal(true);
    setAmountPaid(0);
  };

  const handleCompletePayment = async () => {
    if (!user || !store) return;

    try {
      const transactionNumber = generateTransactionNumber(Date.now() % 10000);
      
      const transaction = await createTransaction(
        store.id,
        user.id,
        {
          store_id: store.id,
          kasir_id: user.id,
          transaction_number: transactionNumber,
          subtotal: items.reduce((sum, item) => sum + item.subtotal, 0),
          discount,
          total,
          payment_method: paymentMethod,
          amount_paid: amountPaid,
          change: amountPaid - total,
          status: 'completed',
          notes: null,
        },
        items.map(item => ({
          product_id: item.product_id,
          product_name_snapshot: item.product_name,
          product_code: item.product_code,
          price_snapshot: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }))
      );

      setCompletedTransaction(transaction);
      clear();
      setShowPaymentModal(false);
      loadProducts(); // Refresh products to update stock
    } catch (error) {
      console.error('Payment error:', error);
      alert('Transaksi gagal. Silakan coba lagi.');
    }
  };

  const change = amountPaid - total;
  const canPay = amountPaid >= total && total > 0;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Search & Product Section */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-4">🏪 {store?.name || 'Kasir'}</h1>
          <ProductSearch
            products={products}
            onSelectProduct={(product, quantity) => {
              try {
                addProduct(product, quantity);
              } catch (error) {
                alert((error as Error).message);
              }
            }}
            isLoading={productsLoading}
          />
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <CartDisplay
            items={items}
            discount={discount}
            subtotal={items.reduce((sum, item) => sum + item.subtotal, 0)}
            total={total}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeProduct}
            onCheckout={handleCheckout}
            onClearCart={clear}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Pembayaran" size="md">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Pembayaran</p>
            <p className="text-3xl font-bold text-sky-600">{formatCurrency(total)}</p>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Metode Pembayaran</label>
            <div className="space-y-2">
              {(['cash', 'qris', 'card', 'other'] as PaymentMethod[]).map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <span className="capitalize">
                    {method === 'cash' && '💵 Tunai'}
                    {method === 'qris' && '📱 QRIS'}
                    {method === 'card' && '💳 Kartu Debit'}
                    {method === 'other' && '❓ Lainnya'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Amount Paid */}
          {paymentMethod === 'cash' && (
            <div>
              <Input
                type="number"
                label="Uang Diterima"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="0"
              />
            </div>
          )}

          {/* Change */}
          {paymentMethod === 'cash' && amountPaid > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Kembalian</p>
              <p className={`text-2xl font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.max(0, change))}
              </p>
              {change < 0 && (
                <p className="text-sm text-red-600 mt-1">⚠️ Uang kurang {formatCurrency(Math.abs(change))}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button
              size="lg"
              onClick={handleCompletePayment}
              disabled={!canPay && paymentMethod === 'cash'}
              className="w-full"
            >
              Selesaikan Pembayaran
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowPaymentModal(false)}
              className="w-full"
            >
              Batal
            </Button>
          </div>
        </div>
      </Modal>

      {/* Transaction Success Modal */}
      {completedTransaction && (
        <Modal isOpen={true} onClose={() => setCompletedTransaction(null)} title="✅ Transaksi Berhasil" size="sm">
          <div className="text-center space-y-4">
            <p className="text-3xl">✅</p>
            <div>
              <p className="text-sm text-gray-600">Nomor Transaksi</p>
              <p className="text-lg font-bold text-gray-900">{completedTransaction.transaction_number}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-sky-600">{formatCurrency(completedTransaction.total)}</p>
            </div>
            <Button size="lg" onClick={() => setCompletedTransaction(null)} className="w-full">
              Transaksi Baru
            </Button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
