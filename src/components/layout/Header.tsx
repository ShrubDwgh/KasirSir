import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSyncStore } from '@/store/syncStore';

export function Header() {
  const { isOnline } = useOnlineStatus();
  const { pendingSyncCount } = useSyncStore();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">KasirKu</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Online Status */}
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-orange-500'
              }`}
            />
            <span className="text-gray-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Sync Status */}
          {pendingSyncCount > 0 && !isOnline && (
            <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {pendingSyncCount} menunggu sinkronisasi
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
