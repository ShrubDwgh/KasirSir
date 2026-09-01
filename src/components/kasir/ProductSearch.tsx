import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/formatting';

interface ProductSearchProps {
  products: Product[];
  onSelectProduct: (product: Product, quantity: number) => void;
  isLoading?: boolean;
}

export function ProductSearch({
  products,
  onSelectProduct,
  isLoading = false,
}: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = () => {
    if (selectedProduct) {
      onSelectProduct(selectedProduct, quantity);
      setSelectedProduct(null);
      setQuantity(1);
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Cari barang (nama/kode)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="text-lg"
      />

      {/* Product List */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`p-3 cursor-pointer ${
                selectedProduct?.id === product.id ? 'ring-2 ring-sky-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.code}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sky-600">
                    {formatCurrency(product.selling_price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Stok: {product.stock}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? 'Produk tidak ditemukan' : 'Mulai ketik untuk mencari'}
        </div>
      )}

      {/* Quantity & Add Button */}
      {selectedProduct && (
        <div className="bg-sky-50 p-4 rounded-lg space-y-3">
          <div>
            <p className="font-semibold text-gray-900">{selectedProduct.name}</p>
            <p className="text-sm text-gray-600">
              Harga: {formatCurrency(selectedProduct.selling_price)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-white border border-gray-300 rounded-lg"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max={selectedProduct.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 text-center border border-gray-300 rounded-lg py-2"
            />
            <button
              onClick={() =>
                setQuantity(Math.min(selectedProduct.stock, quantity + 1))
              }
              className="w-10 h-10 bg-white border border-gray-300 rounded-lg"
            >
              +
            </button>
          </div>
          <Button
            size="lg"
            onClick={handleAddToCart}
            isLoading={isLoading}
            disabled={quantity > selectedProduct.stock}
            className="w-full"
          >
            Tambah ke Keranjang
          </Button>
        </div>
      )}
    </div>
  );
}
