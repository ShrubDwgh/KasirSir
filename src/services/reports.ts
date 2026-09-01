import { supabase } from './supabase';

/**
 * Get sales summary for today
 */
export async function getTodaysSales(storeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from('transactions')
    .select('total, id')
    .eq('store_id', storeId)
    .eq('status', 'completed')
    .gte('created_at', today.toISOString())
    .lt('created_at', tomorrow.toISOString());

  if (error) throw error;

  const total = (data || []).reduce((sum, tx) => sum + tx.total, 0);
  const count = (data || []).length;

  return { total, count };
}

/**
 * Get best selling products
 */
export async function getBestSellingProducts(
  storeId: string,
  days: number = 30,
  limit: number = 10
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('transaction_items')
    .select(
      `
      product_id,
      product_name_snapshot,
      quantity,
      price_snapshot,
      transactions!inner(created_at)
    `
    )
    .eq('transactions.store_id', storeId)
    .gte('transactions.created_at', startDate.toISOString());

  if (error) throw error;

  // Group and sum quantities
  const products = data?.reduce(
    (acc: any, item: any) => {
      const existing = acc.find(
        (p: any) => p.product_id === item.product_id
      );
      if (existing) {
        existing.total_quantity += item.quantity;
        existing.total_revenue += item.quantity * item.price_snapshot;
      } else {
        acc.push({
          product_id: item.product_id,
          product_name: item.product_name_snapshot,
          total_quantity: item.quantity,
          total_revenue: item.quantity * item.price_snapshot,
        });
      }
      return acc;
    },
    []
  ) || [];

  return products.sort((a: any, b: any) => b.total_quantity - a.total_quantity).slice(0, limit);
}

/**
 * Get sales by date range
 */
export async function getSalesByDateRange(
  storeId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('transactions')
    .select('created_at, total, id')
    .eq('store_id', storeId)
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at');

  if (error) throw error;

  // Group by date
  const salesByDate = (data || []).reduce(
    (acc: any, tx: any) => {
      const date = new Date(tx.created_at).toISOString().split('T')[0];
      const existing = acc.find((item: any) => item.date === date);
      if (existing) {
        existing.total += tx.total;
        existing.count += 1;
      } else {
        acc.push({ date, total: tx.total, count: 1 });
      }
      return acc;
    },
    []
  );

  return salesByDate;
}
