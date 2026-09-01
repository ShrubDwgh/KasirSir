import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAsync } from '@/hooks/useAsync';
import { getTodaysSales, getBestSellingProducts } from '@/services/reports';
import { Layout } from '@/components/layout';
import { Card } from '@/components/common/Card';
import { formatCurrency } from '@/utils/formatting';

export function ReportsPage() {
  const { store } = useAuth();
  const [todaysSales, setTodaysSales] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [bestSelling, setBestSelling] = useState<any[]>([]);

  const { loading: salesLoading, execute: loadSales } = useAsync(
    () => store ? getTodaysSales(store.id) : Promise.resolve({ total: 0, count: 0 })
  );

  const { loading: bestSellingLoading, execute: loadBestSelling } = useAsync(
    () => store ? getBestSellingProducts(store.id, 30, 5) : Promise.resolve([])
  );

  useEffect(() => {
    if (store) {
      loadSales().then((data) => {
        setTodaysSales(data.total);
        setTransactionCount(data.count);
      });
      loadBestSelling().then(setBestSelling);
    }
  }, [store]);

  const avgTransaction = transactionCount > 0 ? todaysSales / transactionCount : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">📊 Laporan</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Penjualan Hari Ini</p>
            <p className="text-2xl font-bold text-sky-600">
              {salesLoading ? '...' : formatCurrency(todaysSales)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Jumlah Transaksi</p>
            <p className="text-2xl font-bold text-gray-900">
              {salesLoading ? '...' : transactionCount}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Rata-rata Transaksi</p>
            <p className="text-2xl font-bold text-green-600">
              {salesLoading ? '...' : formatCurrency(avgTransaction)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p className="text-2xl font-bold text-blue-600">✅ Online</p>
          </Card>
        </div>

        {/* Best Selling Products */}
        <Card className="p-4">
          <h2 className="text-lg font-bold mb-4">🏆 Produk Terlaris (30 hari)</h2>
          {bestSellingLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : bestSelling.length === 0 ? (
            <p className="text-gray-500">Belum ada data</p>
          ) : (
            <div className="space-y-2">
              {bestSelling.map((product, index) => (
                <div key={product.product_id} className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sky-600 w-6">{index + 1}.</span>
                    <span className="text-gray-900">{product.product_name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{product.total_quantity} terjual</p>
                    <p className="text-sm text-gray-500">{formatCurrency(product.total_revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
