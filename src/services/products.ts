import { supabase } from './supabase';
import { Product, Category } from '@/types';

/**
 * Get all products for a store
 */
export async function getProducts(storeId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .eq('status', 'active')
    .order('name');

  if (error) throw error;
  return data as Product[];
}

/**
 * Get product by ID
 */
export async function getProduct(productId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Search products by name, code, or barcode
 */
export async function searchProducts(storeId: string, query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .eq('status', 'active')
    .or(
      `name.ilike.%${query}%,code.ilike.%${query}%,barcode.ilike.%${query}%`
    )
    .order('name');

  if (error) throw error;
  return data as Product[];
}

/**
 * Get product by barcode
 */
export async function getProductByBarcode(storeId: string, barcode: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .eq('barcode', barcode)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data as Product | null;
}

/**
 * Create product
 */
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Update product
 */
export async function updateProduct(productId: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Get all categories for a store
 */
export async function getCategories(storeId: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', storeId)
    .order('name');

  if (error) throw error;
  return data as Category[];
}

/**
 * Create category
 */
export async function createCategory(storeId: string, name: string) {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ store_id: storeId, name }])
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}
