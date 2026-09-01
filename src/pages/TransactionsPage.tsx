import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAsync } from '@/hooks/useAsync';
import { getTransactions, getLatestTransactionNumber } from '@/services/transactions';
import { Layout } from '@/components/layout';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Transaction } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/formatting';

export function TransactionsPage() {
  const { store } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allTransactions, loading, execute: loadTransactions } = useAsync(
    () => store ? getTransactions(store.id) : Promise.resolve([])
  );

  useEffect(() => {
    if (allTransactions) {
      const filtered = allTransactions.filter(
        (tx) => tx.transaction_number.includes(searchQuery) || searchQuery === ''
      );
      setTransactions(filtered);
    }
  }, [allTransactions, searchQuery]);

  useEffect(() => {
    if (store) loadTransactions();
  }, [store]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-4">📋 Riwayat Transaksi</h1>
          <Input
            placeholder="Cari nomor transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : transactions.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">Belum ada transaksi</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <Card key={tx.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{tx.transaction_number}</p>
                    <p className="text-sm text-gray-500">{formatDateTime(tx.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sky-600">{formatCurrency(tx.total)}</p>
                    <p className="text-xs text-gray-500 capitalize">{tx.payment_method}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
