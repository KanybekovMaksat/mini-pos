export function generatePrintData(
  items: any[],
  total: number,
  discount: number,
  paymentType: "cash" | "qr"
) {
  const lines: string[] = [];

  const line = "<CENTER>----------------------------</CENTER>";
  lines.push(`<F3232>${line}</F3232>`);
  lines.push("<F3232><FB><CENTER>Eldik Kassa\r</CENTER></FB></F3232>");
  lines.push(`<F2424><CENTER>${new Date().toLocaleString()}</CENTER></F2424>`);

  items.forEach((item) => {
    const name = item.productName;
    const qty = item.qty;
    const price = item.price;
    const sum = (item.qty * item.price).toFixed(2);

    lines.push(`<F2424>${name}</F2424>`);
    lines.push(`<F2424><CENTER>${qty} × ${price} = ${sum}</CENTER></F2424>`);
  });

  lines.push(line);

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);

  lines.push(`<F2424><CENTER>Подытог: ${subtotal.toFixed(2)}</CENTER></F2424>`);
  lines.push(`<F2424><CENTER>Скидка: ${discount.toFixed(2)}</CENTER></F2424>`);
  lines.push(`<F3232><CENTER>ИТОГО: ${total.toFixed(2)}</CENTER></F3232>`);
  // ---------- ОПЛАТА ----------
  const payment =
    paymentType === "cash" ? "НАЛИЧНЫМИ" : "QR ОПЛАТА";

  lines.push(`<F2424><CENTER>Тип оплаты: ${payment}</CENTER></F2424>`);
  lines.push("<F3232>" + line + "</F3232>");
  lines.push("<CENTER>Спасибо за покупку</CENTER>");
  return lines.join("\r\n");
}
