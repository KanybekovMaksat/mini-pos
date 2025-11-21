import { Receipt } from '../data/mockData';

export function generateReceiptPDF(receipt: Receipt) {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 10px;
    }
    .info {
      margin-bottom: 20px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 14px;
    }
    .label {
      color: #666;
    }
    .value {
      font-weight: bold;
    }
    .items {
      margin: 20px 0;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .item-name {
      flex: 1;
    }
    .item-qty {
      width: 60px;
      text-align: center;
      color: #666;
    }
    .item-price {
      width: 100px;
      text-align: right;
      font-weight: bold;
    }
    .totals {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #333;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 14px;
    }
    .total-final {
      font-size: 20px;
      font-weight: bold;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #333;
    }
    .payment {
      text-align: center;
      margin: 20px 0;
      padding: 15px;
      background: #f3f4f6;
      border-radius: 8px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #333;
      font-size: 12px;
      color: #666;
    }
    .status {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin: 10px 0;
    }
    .status-paid {
      background: #dcfce7;
      color: #166534;
    }
    .status-cancelled {
      background: #fee2e2;
      color: #991b1b;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Mini-POS</div>
    <div style="font-size: 16px; font-weight: bold;">Чек #${receipt.id}</div>
    <div class="status ${receipt.status === 'paid' ? 'status-paid' : 'status-cancelled'}">
      ${receipt.status === 'paid' ? 'ОПЛАЧЕНО' : 'ОТМЕНЕНО'}
    </div>
  </div>

  <div class="info">
    <div class="info-row">
      <span class="label">Дата:</span>
      <span class="value">${new Date(receipt.createdAt).toLocaleString('ru-RU')}</span>
    </div>
    <div class="info-row">
      <span class="label">Кассир:</span>
      <span class="value">${receipt.cashierName}</span>
    </div>
    ${receipt.clientName ? `
    <div class="info-row">
      <span class="label">Клиент:</span>
      <span class="value">${receipt.clientName}</span>
    </div>
    ` : ''}
    <div class="info-row">
      <span class="label">Оплата:</span>
      <span class="value">${receipt.paymentType === 'cash' ? 'Наличные' : 'QR-код'}</span>
    </div>
  </div>

  <div class="items">
    <h3 style="margin-bottom: 10px;">Товары:</h3>
    ${receipt.items.map(item => `
      <div class="item">
        <div class="item-name">${item.productName}</div>
        <div class="item-qty">×${item.qty}</div>
        <div class="item-price">${(item.price * item.qty).toFixed(2)} сом</div>
      </div>
    `).join('')}
  </div>

  <div class="totals">
    <div class="total-row">
      <span>Подытог:</span>
      <span>${(receipt.total + receipt.discount).toFixed(2)} сом</span>
    </div>
    ${receipt.discount > 0 ? `
    <div class="total-row" style="color: #dc2626;">
      <span>Скидка:</span>
      <span>-${receipt.discount.toFixed(2)} сом</span>
    </div>
    ` : ''}
    <div class="total-row total-final">
      <span>ИТОГО:</span>
      <span>${receipt.total.toFixed(2)} сом</span>
    </div>
  </div>

  ${receipt.status === 'cancelled' && receipt.cancelReason ? `
  <div class="payment" style="background: #fee2e2; color: #991b1b;">
    <strong>Причина отмены:</strong><br>
    ${receipt.cancelReason}
  </div>
  ` : ''}

  <div class="footer">
    <p>Спасибо за покупку!</p>
    <p>Mini-POS - веб-касса для вашего бизнеса</p>
    <p>${new Date().getFullYear()} © Все права защищены</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${receipt.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
