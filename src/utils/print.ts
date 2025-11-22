export interface ReceiptItem {
  productName: string;
  qty: number;
  price: number;
}

export function generatePrintData(
  items: ReceiptItem[],
  total: number,
  discount: number,
  paymentType: "cash" | "qr"
) {
  const separator = "----------------------------";
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const payment = paymentType === "cash" ? "НАЛИЧНЫМИ" : "QR ОПЛАТА";

  const itemsString = items
    .map(item => `<F2424>${item.productName}</F2424><F2424><CENTER>${item.qty} × ${item.price} = ${(item.qty * item.price).toFixed(2)}</CENTER></F2424>`)
    .join('');

  return `<F3232><CENTER>${separator}\r</CENTER></F3232>` +
         `<CENTER><F3232>Eldik Kassa</F3232></CENTER>` +
         `<F2424><CENTER>${new Date().toLocaleString('ru-KG', { hour12: false })}</CENTER></F2424>` +
         itemsString +
         `<F3232><CENTER>${separator}</CENTER></F3232>` +
         `<F2424><CENTER>Подытог: ${subtotal.toFixed(2)}</CENTER></F2424>` +
         `<F2424><CENTER>Скидка: ${discount.toFixed(2)}</CENTER></F2424>` +
         `<F3232><CENTER>ИТОГО: ${total.toFixed(2)}</CENTER></F3232>` +
         `<F2424><CENTER>Тип оплаты: ${payment}</CENTER></F2424>` +
         `<CENTER>Спасибо за покупку\r</CENTER>`;
}
