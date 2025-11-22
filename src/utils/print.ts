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
  const lines: string[] = [];
  const separator = "----------------------------";

  lines.push(`<F3232><CENTER>----------------------------\r</CENTER></F3232>`);
  lines.push(`<CENTER><F3232>Eldik Kassa</F3232></CENTER>`);
  lines.push(`<F2424><CENTER>${new Date().toLocaleString('ru-KG', { hour12: false })}</CENTER></F2424>`);

  items.forEach(item => {
    const sum = (item.qty * item.price).toFixed(2);
    lines.push(`<F2424>${item.productName}</F2424>`);
    lines.push(`<F2424><CENTER>${item.qty} × ${item.price} = ${sum}</CENTER></F2424>`);
  });

  lines.push(`<F3232><CENTER>${separator}</CENTER></F3232>`);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  lines.push(`<F2424><CENTER>Подытог: ${subtotal.toFixed(2)}</CENTER></F2424>`);
  lines.push(`<F2424><CENTER>Скидка: ${discount.toFixed(2)}</CENTER></F2424>`);
  lines.push(`<F3232><CENTER>ИТОГО: ${total.toFixed(2)}</CENTER></F3232>`);

  const payment = paymentType === "cash" ? "НАЛИЧНЫМИ" : "QR ОПЛАТА";
  lines.push(`<F2424><CENTER>Тип оплаты: ${payment}</CENTER></F2424>`);

  lines.push(`<CENTER>Спасибо за покупку\r</CENTER>\r\n`);

  return lines.join("\r\n");
}
