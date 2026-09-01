import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAsync } from '@/hooks/useAsync';
import { getProducts, createProduct } from '@/services/products';
import { Layout } from '@/components/layout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Card } from '@/components/common/Card';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/formatting';

export function ProductsPage() {
  const { store } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    barcode: '',
    purchase_price: 0,
    selling_price: 0,
    stock: 0,
    min_stock: 0,
  });

  const { data: allProducts, loading, execute: loadProducts } = useAsync(
    () => store ? getProducts(store.id) : Promise.resolve([])
  );

  useEffect(() => {
    if (allProducts) setProducts(allProducts);
  }, [allProducts]);

  useEffect(() => {
    if (store) loadProducts();
  }, [store]);

  const handleAddProduct = async () => {
    if (!store) return;

    try {
      const newProduct = await createProduct({
        store_id: store.id,
        name: formData.name,
        code: formData.code,
        barcode: formData.barcode || null,
        category_id: null,
        purchase_price: formData.purchase_price,
        selling_price: formData.selling_price,
        stock: formData.stock,
        min_stock: formData.min_stock,
        image_url: null,
        status: 'active',
      });

      setProducts([...products, newProduct]);
      setShowModal(false);
      setFormData({
        name: '',
        code: '',
        barcode: '',
        purchase_price: 0,
        selling_price: 0,
        stock: 0,
        min_stock: 0,
      });
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">📦 Produk</h1>
          <Button onClick={() => setShowModal(true)}>+ Tambah Produk</Button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500 mb-4">Belum ada produk</p>
            <p className="text-sm text-gray-400 mb-4">Tambahkan produk pertama untuk mulai berjualan</p>
            <Button onClick={() => setShowModal(true)}>+ Tambah Produk Pertama</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.code}</p>
                </div>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga Jual</span>
                    <span className="font-semibold text-sky-600">{formatCurrency(product.selling_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stok</span>
                    <span className={`font-semibold ${product.stock > product.min_stock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Produk" size="md">
        <div className="space-y-4">
          <Input
            label="Nama Produk *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Misal: Indomie Goreng"
          />
          <Input
            label="Kode Produk *"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Misal: IND001"
          />
          <Input
            label="Barcode"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            placeholder="Opsional"
          />
          <Input
            label="Harga Beli (Rp) *"
            type="number"
            value={formData.purchase_price}
            onChange={(e) => setFormData({ ...formData, purchase_price: parseFloat(e.target.value) || 0 })}
            placeholder="0"
          />
          <Input
            label="Harga Jual (Rp) *"
            type="number"
            value={formData.selling_price}
            onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
            placeholder="0"
          />
          <Input
            label="Stok Awal *"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
          <Input
            label="Stok Minimum"
            type="number"
            value={formData.min_stock}
            onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
          <div className="flex gap-2 pt-4">
            <Button size="lg" onClick={handleAddProduct} className="flex-1">
              Simpan
            </Button>
            <Button variant="secondary" size="lg" onClick={() => setShowModal(false)} className="flex-1">
              Batal
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
