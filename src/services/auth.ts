import { supabase } from './supabase';
import { User } from '@/types';

/**
 * Get user profile from database
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as User;
}

/**
 * Get store by owner ID
 */
export async function getStoreByOwnerId(ownerId: string) {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', ownerId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get store by user ID (for kasir)
 */
export async function getStoreByUserId(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('store_id')
    .eq('id', userId)
    .single();

  if (error) throw error;

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('id', data.store_id)
    .single();

  if (storeError) throw storeError;
  return store;
}

/**
 * Create new user in database (after auth signup)
 */
export async function createUserInDatabase(
  userId: string,
  email: string,
  fullName: string,
  storeId: string,
  role: 'owner' | 'kasir'
) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        id: userId,
        email,
        full_name: fullName,
        store_id: storeId,
        role,
        status: 'active',
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
}

/**
 * Update last login
 */
export async function updateLastLogin(userId: string) {
  const { error } = await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId);

  if (error) throw error;
}
