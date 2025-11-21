import { useState, useMemo } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, QrCode, Banknote, Percent, Search, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ReceiptItem } from '../data/mockData';
import QRCodeModal from './QRCodeModal';
import AddCart from './AddCart';

export default function POS() {
  const { products, addReceipt, clients } = useApp();
  const { user } = useAuth();
  const [cart, setCart] = useState<ReceiptItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showFastOnly, setShowFastOnly] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const displayProducts = useMemo(() => {
    let filtered = products;

    if (showFastOnly) {
      filtered = filtered.filter(p => p.isFastProduct);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setShowFastOnly(false);
    }

    return filtered;
  }, [products, showFastOnly, searchTerm]);

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        qty: 1,
        price: product.price
      }]);
    }
  };

  const updateQty = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal - discount;

  const handlePayment = (paymentType: 'cash' | 'qr') => {
    if (cart.length === 0) return;

    const client = selectedClient ? clients.find(c => c.id === selectedClient) : undefined;

    addReceipt({
      pointId: user!.pointId,
      cashierId: user!.id,
      cashierName: user!.name,
      clientId: client?.id,
      clientName: client?.name,
      items: cart,
      total,
      discount,
      paymentType,
      status: 'paid',
      createdAt: new Date().toISOString()
    });

    setCart([]);
    setDiscount(0);
    setSelectedClient('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-4 p-4 max-w-7xl mx-auto">
      <div className="flex-1 flex flex-col">
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { setShowFastOnly(true); setSearchTerm(''); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                showFastOnly && !searchTerm
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Быстрые товары
            </button>
            <button
              onClick={() => { setShowFastOnly(false); setSearchTerm(''); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                !showFastOnly && !searchTerm
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Все товары
            </button>
          </div>
        </div>
        <div className="w-[300px]">
            <AddCart onAddToCart={(productId) => addToCart(productId)} />
        </div>

        <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product.id)}
                className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-4 rounded-xl transition text-left"
              >
                <p className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</p>
                <p className="text-lg font-bold text-blue-600">{product.price} с</p>
                <p className="text-xs text-gray-600 mt-1">{product.category}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:w-96 flex flex-col bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Чек</h2>
          <span className="ml-auto bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
            {cart.length}
          </span>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Клиент</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Без клиента</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.phone})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Корзина пуста</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-900 flex-1">{item.productName}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="p-1 hover:bg-gray-100 rounded-l-lg transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="p-1 hover:bg-gray-100 rounded-r-lg transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-bold text-blue-600">{item.price * item.qty} с</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-gray-400" />
            <input
              type="number"
              min="0"
              max={subtotal}
              value={discount}
              onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="Скидка"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-600 font-medium">сом</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Подытог:</span>
              <span className="font-medium">{subtotal.toFixed(2)} сом</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Скидка:</span>
                <span className="font-medium">-{discount.toFixed(2)} сом</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Итого:</span>
              <span>{total.toFixed(2)} сом</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePayment('cash')}
              disabled={cart.length === 0}
              className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Banknote className="w-5 h-5" />
              Наличные
            </button>
            <button
              onClick={() => setShowQRModal(true)}
              disabled={cart.length === 0}
              className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              QR
            </button>
          </div>
        </div>
      </div>

      {showQRModal && (
        <QRCodeModal
          amount={total}
          onClose={() => setShowQRModal(false)}
          onConfirm={() => {
            handlePayment('qr');
            setShowQRModal(false);
          }}
        />
      )}

      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-3">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="font-medium">Чек успешно создан!</span>
        </div>
      )}
    </div>
  );
}
