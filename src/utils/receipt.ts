import { Transaction, TransactionItem, Store } from '@/types';
import { formatDateTime, formatCurrency } from './formatting';

/**
 * Generate receipt HTML
 */
export function generateReceiptHTML(
  transaction: Transaction,
  items: TransactionItem[],
  store: Store
): string {
  const itemsHTML = items
    .map(
      (item) => `
    <tr>
      <td style="text-align: left; padding: 8px 0;">${item.product_name_snapshot}</td>
      <td style="text-align: center; padding: 8px 0;">${item.quantity}</td>
      <td style="text-align: right; padding: 8px 0;">${formatCurrency(item.price_snapshot)}</td>
      <td style="text-align: right; padding: 8px 0; border-bottom: 1px solid #ddd;">${formatCurrency(item.subtotal)}</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f5f5f5;
        }
        .receipt {
          background: white;
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        .store-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .store-info {
          font-size: 12px;
          color: #666;
        }
        .invoice-number {
          font-weight: bold;
          margin: 10px 0;
        }
        .datetime {
          font-size: 12px;
          color: #666;
          margin-bottom: 10px;
        }
        .items {
          width: 100%;
          margin: 10px 0;
        }
        .items td {
          font-size: 13px;
        }
        .totals {
          margin-top: 10px;
          border-top: 2px solid #000;
          padding-top: 10px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 5px;
        }
        .total-amount {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          font-size: 16px;
          border-top: 1px solid #ddd;
          padding-top: 5px;
          margin-top: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          border-top: 2px solid #000;
          padding-top: 10px;
          font-size: 12px;
        }
        .payment-method {
          font-size: 12px;
          color: #666;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="store-name">${store.name}</div>
          <div class="store-info">${store.address}</div>
          <div class="store-info">${store.phone}</div>
        </div>
        
        <div class="invoice-number">Invoice: ${transaction.transaction_number}</div>
        <div class="datetime">${formatDateTime(transaction.created_at)}</div>
        
        <table class="items">
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>${formatCurrency(transaction.subtotal)}</span>
          </div>
          ${transaction.discount > 0 ? `
            <div class="total-row">
              <span>Diskon</span>
              <span>-${formatCurrency(transaction.discount)}</span>
            </div>
          ` : ''}
          <div class="total-amount">
            <span>Total</span>
            <span>${formatCurrency(transaction.total)}</span>
          </div>
          <div class="total-row" style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 5px;">
            <span>Pembayaran</span>
            <span>${formatCurrency(transaction.amount_paid)}</span>
          </div>
          <div class="total-row">
            <span>Kembalian</span>
            <span>${formatCurrency(transaction.change)}</span>
          </div>
          <div class="payment-method">
            Metode: ${transaction.payment_method.toUpperCase()}
          </div>
        </div>
        
        <div class="footer">
          <p>Terima kasih telah berbelanja</p>
          <p style="margin: 5px 0; color: #999;">${formatDateTime(new Date())}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
