import { useState, useEffect } from 'react';
import { useSyncStore } from '@/store/syncStore';
import { onOnlineStatusChange } from '@/utils/offline';

export function useOnlineStatus() {
  const { isOnline, setIsOnline } = useSyncStore();
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Set initial state
    setConnected(navigator.onLine);
    setIsOnline(navigator.onLine);

    // Listen for online/offline changes
    const unsubscribe = onOnlineStatusChange((status) => {
      setConnected(status);
      setIsOnline(status);
    });

    return unsubscribe;
  }, [setIsOnline]);

  return { isOnline, connected };
}
