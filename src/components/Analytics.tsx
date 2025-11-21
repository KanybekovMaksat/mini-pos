import { useState } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, Users, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function Analytics() {
  const { receipts, products } = useApp();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  const now = new Date();
  const getStartDate = () => {
    if (period === 'day') {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return weekAgo;
    } else {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    }
  };

  const startDate = getStartDate();
  const periodReceipts = receipts.filter(r =>
    r.status === 'paid' && new Date(r.createdAt) >= startDate
  );

  const totalRevenue = periodReceipts.reduce((sum, r) => sum + r.total, 0);
  const totalReceipts = periodReceipts.length;
  const averageCheck = totalReceipts > 0 ? totalRevenue / totalReceipts : 0;

  const productSales = new Map<string, { name: string; count: number; revenue: number; category: string }>();
  periodReceipts.forEach(receipt => {
    receipt.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      const existing = productSales.get(item.productId);
      if (existing) {
        existing.count += item.qty;
        existing.revenue += item.price * item.qty;
      } else {
        productSales.set(item.productId, {
          name: item.productName,
          count: item.qty,
          revenue: item.price * item.qty,
          category: product?.category || 'Без категории'
        });
      }
    });
  });

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const categorySales = new Map<string, { revenue: number; count: number }>();
  Array.from(productSales.values()).forEach(product => {
    const existing = categorySales.get(product.category);
    if (existing) {
      existing.revenue += product.revenue;
      existing.count += product.count;
    } else {
      categorySales.set(product.category, {
        revenue: product.revenue,
        count: product.count
      });
    }
  });

  const topCategories = Array.from(categorySales.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const cashPayments = periodReceipts.filter(r => r.paymentType === 'cash');
  const qrPayments = periodReceipts.filter(r => r.paymentType === 'qr');
  const cashPercent = totalReceipts > 0 ? (cashPayments.length / totalReceipts) * 100 : 0;
  const qrPercent = totalReceipts > 0 ? (qrPayments.length / totalReceipts) * 100 : 0;

  const dailyRevenue = new Map<string, number>();
  periodReceipts.forEach(receipt => {
    const date = new Date(receipt.createdAt).toISOString().split('T')[0];
    dailyRevenue.set(date, (dailyRevenue.get(date) || 0) + receipt.total);
  });

  const revenueData = Array.from(dailyRevenue.entries())
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-gray-600 text-sm mt-1">Анализ продаж и эффективности</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('day')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 'day'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            День
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Месяц
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Выручка</p>
              <p className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(0)} с</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Средний чек</p>
              <p className="text-2xl font-bold text-gray-900">{averageCheck.toFixed(0)} с</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Чеков</p>
              <p className="text-2xl font-bold text-gray-900">{totalReceipts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Период</p>
              <p className="text-2xl font-bold text-gray-900">
                {period === 'day' ? 'Сегодня' : period === 'week' ? '7 дней' : '30 дней'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">График продаж (последние 7 дней)</h3>
          </div>

          {revenueData.length > 0 ? (
            <div className="space-y-4">
              {revenueData.map(({ date, revenue }) => (
                <div key={date}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{revenue.toFixed(2)} с</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all"
                      style={{ width: `${(revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Нет данных за выбранный период</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Способы оплаты</h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">Наличные</p>
                  <p className="text-sm text-gray-600">{cashPayments.length} чеков</p>
                </div>
                <p className="text-2xl font-bold text-green-600">{cashPercent.toFixed(1)}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${cashPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">QR-оплата</p>
                  <p className="text-sm text-gray-600">{qrPayments.length} чеков</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{qrPercent.toFixed(1)}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${qrPercent}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-700 mb-2 font-medium">Общая статистика</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Наличные</p>
                  <p className="text-lg font-bold text-gray-900">
                    {cashPayments.reduce((sum, r) => sum + r.total, 0).toFixed(0)} с
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">QR</p>
                  <p className="text-lg font-bold text-gray-900">
                    {qrPayments.reduce((sum, r) => sum + r.total, 0).toFixed(0)} с
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">ТОП-10 товаров</h3>
          </div>

          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' :
                    'bg-blue-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.count} шт · {product.category}</p>
                  </div>
                  <p className="font-bold text-gray-900">{product.revenue.toFixed(0)} с</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Нет данных о продажах</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">ТОП-5 категорий</h3>
          </div>

          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-sm text-gray-600">{category.count} шт</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{category.revenue.toFixed(0)} с</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${totalRevenue > 0 ? (category.revenue / totalRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Нет данных о категориях</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
