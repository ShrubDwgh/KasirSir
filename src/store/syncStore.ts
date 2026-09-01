import { create } from 'zustand';

interface SyncState {
  isOnline: boolean;
  pendingSyncCount: number;
  lastSyncTime: string | null;
  setIsOnline: (online: boolean) => void;
  setPendingSyncCount: (count: number) => void;
  setLastSyncTime: (time: string | null) => void;
  incrementPendingSyncCount: () => void;
  decrementPendingSyncCount: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: navigator.onLine,
  pendingSyncCount: 0,
  lastSyncTime: null,
  setIsOnline: (online) => set({ isOnline: online }),
  setPendingSyncCount: (count) => set({ pendingSyncCount: count }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
  incrementPendingSyncCount: () =>
    set((state) => ({ pendingSyncCount: state.pendingSyncCount + 1 })),
  decrementPendingSyncCount: () =>
    set((state) => ({
      pendingSyncCount: Math.max(0, state.pendingSyncCount - 1),
    })),
}));
