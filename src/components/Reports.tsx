import { useState } from 'react';
import { TrendingUp, DollarSign, Receipt, QrCode, Banknote, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function Reports() {
  const { receipts } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const todayReceipts = receipts.filter(r => {
    const receiptDate = new Date(r.createdAt).toISOString().split('T')[0];
    return receiptDate === selectedDate && r.status === 'paid';
  });

  const totalReceipts = todayReceipts.length;
  const totalRevenue = todayReceipts.reduce((sum, r) => sum + r.total, 0);
  const cashRevenue = todayReceipts.filter(r => r.paymentType === 'cash').reduce((sum, r) => sum + r.total, 0);
  const qrRevenue = todayReceipts.filter(r => r.paymentType === 'qr').reduce((sum, r) => sum + r.total, 0);
  const averageCheck = totalReceipts > 0 ? totalRevenue / totalReceipts : 0;

  const cashCount = todayReceipts.filter(r => r.paymentType === 'cash').length;
  const qrCount = todayReceipts.filter(r => r.paymentType === 'qr').length;

  const productSales = new Map<string, { name: string; count: number; revenue: number }>();
  todayReceipts.forEach(receipt => {
    receipt.items.forEach(item => {
      const existing = productSales.get(item.productId);
      if (existing) {
        existing.count += item.qty;
        existing.revenue += item.price * item.qty;
      } else {
        productSales.set(item.productId, {
          name: item.productName,
          count: item.qty,
          revenue: item.price * item.qty
        });
      }
    });
  });

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Отчёт дня</h1>
          <p className="text-gray-600 text-sm mt-1">Статистика продаж за выбранную дату</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Receipt className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-blue-100 text-sm mb-1">Количество чеков</p>
          <p className="text-3xl font-bold">{totalReceipts}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-green-100 text-sm mb-1">Выручка</p>
          <p className="text-3xl font-bold">{totalRevenue.toFixed(2)} с</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-purple-100 text-sm mb-1">Средний чек</p>
          <p className="text-3xl font-bold">{averageCheck.toFixed(2)} с</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-orange-100 text-sm mb-1">Дата</p>
          <p className="text-xl font-bold">
            {new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Способы оплаты</h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Banknote className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Наличные</p>
                    <p className="text-sm text-gray-600">{cashCount} чеков</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">{cashRevenue.toFixed(2)} с</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${totalRevenue > 0 ? (cashRevenue / totalRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <QrCode className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">QR-код</p>
                    <p className="text-sm text-gray-600">{qrCount} чеков</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">{qrRevenue.toFixed(2)} с</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${totalRevenue > 0 ? (qrRevenue / totalRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">ТОП-5 товаров</h3>

          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.count} шт</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{product.revenue.toFixed(2)} с</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${totalRevenue > 0 ? (product.revenue / totalRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Нет данных за выбранную дату</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Последние чеки</h3>

        {todayReceipts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Чек №</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Время</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Кассир</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Оплата</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {todayReceipts.slice(0, 10).map(receipt => (
                  <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-900">#{receipt.id}</td>
                    <td className="py-3 px-2 text-gray-600">
                      {new Date(receipt.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-2 text-gray-600">{receipt.cashierName}</td>
                    <td className="py-3 px-2">
                      {receipt.paymentType === 'cash' ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <Banknote className="w-4 h-4" />
                          Наличные
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-600">
                          <QrCode className="w-4 h-4" />
                          QR
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-gray-900">{receipt.total} с</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Нет чеков за выбранную дату</p>
          </div>
        )}
      </div>
    </div>
  );
}
