import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/services/supabase';
import { Layout } from '@/components/layout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';

export function SettingsPage() {
  const { user, store, logout } = useAuth();
  const [storeData, setStoreData] = useState({
    name: store?.name || '',
    address: store?.address || '',
    phone: store?.phone || '',
  });

  const handleLogout = async () => {
    await signOut();
    logout();
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">⚙️ Pengaturan</h1>

        {/* Store Information */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">🏪 Informasi Toko</h2>
          <div className="space-y-4">
            <Input
              label="Nama Toko"
              value={storeData.name}
              onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
              disabled
            />
            <Input
              label="Alamat"
              value={storeData.address}
              onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
              disabled
            />
            <Input
              label="Nomor Telepon"
              value={storeData.phone}
              onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
              disabled
            />
            <p className="text-xs text-gray-500">Hubungi owner untuk mengubah pengaturan toko</p>
          </div>
        </Card>

        {/* User Information */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">👤 Profil Kasir</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Nama Lengkap</label>
              <p className="text-lg font-semibold text-gray-900">{user?.full_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Role</label>
              <p className="text-lg font-semibold text-sky-600 capitalize">{user?.role}</p>
            </div>
          </div>
        </Card>

        {/* Logout */}
        <Button
          variant="danger"
          size="lg"
          onClick={handleLogout}
          className="w-full"
        >
          🚪 Logout
        </Button>
      </div>
    </Layout>
  );
}
