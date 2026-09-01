import { supabase } from './supabase';
import { Transaction, TransactionItem } from '@/types';

/**
 * Create transaction with items
 */
export async function createTransaction(
  storeId: string,
  kasirId: string,
  transaction: Omit<Transaction, 'id' | 'created_at'>,
  items: Omit<TransactionItem, 'id' | 'transaction_id' | 'created_at'>[]
) {
  // Start transaction
  const { data: txData, error: txError } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single();

  if (txError) throw txError;

  const transactionId = txData.id;

  // Insert transaction items
  const itemsWithTransactionId = items.map((item) => ({
    ...item,
    transaction_id: transactionId,
  }));

  const { error: itemsError } = await supabase
    .from('transaction_items')
    .insert(itemsWithTransactionId);

  if (itemsError) throw itemsError;

  return txData as Transaction;
}

/**
 * Get transaction by ID with items
 */
export async function getTransaction(transactionId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      *,
      transaction_items (*)
    `
    )
    .eq('id', transactionId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all transactions for a store
 */
export async function getTransactions(
  storeId: string,
  limit: number = 50,
  offset: number = 0
) {
  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      *,
      transaction_items (*)
    `
    )
    .eq('store_id', storeId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

/**
 * Get transactions by date range
 */
export async function getTransactionsByDateRange(
  storeId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      *,
      transaction_items (*)
    `
    )
    .eq('store_id', storeId)
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get latest transaction number for a store
 */
export async function getLatestTransactionNumber(storeId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('transaction_number')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data[0]?.transaction_number || null;
}

/**
 * Void transaction
 */
export async function voidTransaction(
  transactionId: string,
  userId: string,
  notes?: string
) {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      status: 'voided',
      voided_at: new Date().toISOString(),
      voided_by: userId,
      notes,
    })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}
