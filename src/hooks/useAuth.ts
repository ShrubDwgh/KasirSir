import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getCurrentUser, getSession } from '@/services/supabase';
import { getUserProfile, getStoreByUserId } from '@/services/auth';

export function useAuth() {
  const { user, store, setUser, setStore, setLoading, setError } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        setInitialized(true);
        return;
      }

      // Get user profile from database
      const userProfile = await getUserProfile(currentUser.id);
      setUser(userProfile as any);

      // Get store
      const userStore = await getStoreByUserId(currentUser.id);
      setStore(userStore);
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }

  return { user, store, initialized, initializeAuth };
}
