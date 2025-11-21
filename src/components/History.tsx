import { useState } from 'react';
import { Receipt, Search, Calendar, Banknote, QrCode, X, Ban, FileText } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Receipt as ReceiptType } from '../data/mockData';

export default function History() {
  const { receipts, cancelReceipt } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState<'all' | 'cash' | 'qr'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'cancelled'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptType | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.id.includes(searchTerm) ||
      receipt.cashierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPayment = filterPayment === 'all' || receipt.paymentType === filterPayment;
    const matchesStatus = filterStatus === 'all' || receipt.status === filterStatus;

    return matchesSearch && matchesPayment && matchesStatus;
  });

  const handleCancelReceipt = () => {
    if (selectedReceipt && cancelReason.trim()) {
      cancelReceipt(selectedReceipt.id, cancelReason);
      setShowCancelModal(false);
      setSelectedReceipt(null);
      setCancelReason('');
    }
  };

  const generatePDF = (receipt: ReceiptType) => {
    import('../utils/pdfGenerator').then(({ generateReceiptPDF }) => {
      generateReceiptPDF(receipt);
    });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">История чеков</h1>
        <p className="text-gray-600 text-sm">{receipts.length} чеков в базе</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по чеку, кассиру или товару..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Все способы оплаты</option>
          <option value="cash">Наличные</option>
          <option value="qr">QR-код</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Все статусы</option>
          <option value="paid">Оплачено</option>
          <option value="cancelled">Отменено</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredReceipts.map(receipt => (
          <div
            key={receipt.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedReceipt(receipt)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  receipt.status === 'paid' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <Receipt className={`w-6 h-6 ${
                    receipt.status === 'paid' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">Чек #{receipt.id}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      receipt.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {receipt.status === 'paid' ? 'Оплачено' : 'Отменено'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(receipt.createdAt).toLocaleString('ru-RU')}
                    </span>
                    <span>Кассир: {receipt.cashierName}</span>
                    {receipt.clientName && (
                      <span className="text-blue-600">Клиент: {receipt.clientName}</span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {receipt.items.slice(0, 3).map(item => (
                      <span key={item.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {item.productName} x{item.qty}
                      </span>
                    ))}
                    {receipt.items.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{receipt.items.length - 3} ещё
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-2">
                <div className="flex items-center gap-2">
                  {receipt.paymentType === 'cash' ? (
                    <Banknote className="w-5 h-5 text-green-600" />
                  ) : (
                    <QrCode className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900">{receipt.total} с</p>
              </div>
            </div>
          </div>
        ))}

        {filteredReceipts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Receipt className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>Чеки не найдены</p>
          </div>
        )}
      </div>

      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedReceipt(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Чек #{selectedReceipt.id}</h2>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  selectedReceipt.status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedReceipt.status === 'paid' ? 'Оплачено' : 'Отменено'}
                </span>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Дата и время</p>
                  <p className="font-medium">{new Date(selectedReceipt.createdAt).toLocaleString('ru-RU')}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Кассир</p>
                  <p className="font-medium">{selectedReceipt.cashierName}</p>
                </div>
                {selectedReceipt.clientName && (
                  <div>
                    <p className="text-gray-600 mb-1">Клиент</p>
                    <p className="font-medium text-blue-600">{selectedReceipt.clientName}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600 mb-1">Способ оплаты</p>
                  <div className="flex items-center gap-2">
                    {selectedReceipt.paymentType === 'cash' ? (
                      <>
                        <Banknote className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Наличные</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">QR-код</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {selectedReceipt.status === 'cancelled' && selectedReceipt.cancelReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    <strong>Причина отмены:</strong> {selectedReceipt.cancelReason}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Товары</h3>
              <div className="space-y-2">
                {selectedReceipt.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">{item.price} сом × {item.qty}</p>
                    </div>
                    <p className="font-bold text-gray-900">{item.price * item.qty} сом</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Подытог:</span>
                  <span className="font-medium">{selectedReceipt.total + selectedReceipt.discount} сом</span>
                </div>
                {selectedReceipt.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Скидка:</span>
                    <span className="font-medium">-{selectedReceipt.discount} сом</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Итого:</span>
                  <span>{selectedReceipt.total} сом</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => generatePDF(selectedReceipt)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Скачать PDF
              </button>
              {selectedReceipt.status === 'paid' && (
                <button
                  onClick={() => {
                    setShowCancelModal(true);
                  }}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <Ban className="w-5 h-5" />
                  Отменить чек
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showCancelModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Отменить чек</h2>
              <button onClick={() => setShowCancelModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Причина отмены
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Укажите причину отмены чека..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleCancelReceipt}
                disabled={!cancelReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
