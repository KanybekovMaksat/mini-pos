import { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  QrCode,
  Banknote,
  Percent,
  Search,
  User,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ReceiptItem } from '../data/mockData';
import QRCodeModal from './QRCodeModal';
import AddCart from './AddCart';
import { generatePrintData } from '../utils/print';

export default function POS() {
  const { products, addReceipt, clients, debts, addDebt, payDebt, addClient } =
    useApp();
  const { user } = useAuth();

  const [cart, setCart] = useState<ReceiptItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showFastOnly, setShowFastOnly] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [debtPayment, setDebtPayment] = useState(0);
  const [newDebtAmount, setNewDebtAmount] = useState(0);

  const clientDebt = selectedClient
    ? debts.find((d) => d.clientId === selectedClient)
    : undefined;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal - discount;

  const displayProducts = useMemo(() => {
    let filtered = products;
    if (showFastOnly) filtered = filtered.filter((p) => p.isFastProduct);
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setShowFastOnly(false);
    }
    return filtered;
  }, [products, showFastOnly, searchTerm]);

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: Date.now().toString(),
          productId: product.id,
          productName: product.name,
          qty: 1,
          price: product.price,
        },
      ]);
    }
  };

  const updateQty = (itemId: string, delta: number) => {
    setCart(
      cart.map((item) =>
        item.id === itemId
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const handleAddClient = () => {
    if (!newClientName || !newClientPhone) return;
    const newClient = {
      id: Date.now().toString(),
      name: newClientName,
      phone: newClientPhone,
    };
    if (addClient) addClient(newClient); // безопасное добавление через useApp
    setSelectedClient(newClient.id);
    setNewClientName('');
    setNewClientPhone('');
    setShowAddClient(false);
  };

  const handlePayment = async (paymentType: 'cash' | 'qr') => {
    if (!cart.length) return;

    const clientInfo = selectedClient
      ? clients.find((c) => c.id === selectedClient)
      : undefined;
    const receiptData = {
      pointId: user!.pointId,
      cashierId: user!.id,
      cashierName: user!.name,
      clientId: clientInfo?.id,
      clientName: clientInfo?.name,
      items: cart,
      total,
      discount,
      paymentType,
      status: 'paid',
      createdAt: new Date().toISOString(),
    };
    addReceipt(receiptData);

    const payload = {
      request_id: Date.now().toString(),
      biz_type: '1',
      broadcast_type: '1',
      money: total.toString(),
      printdata: generatePrintData(cart, total, discount, paymentType),
    };
    try {
      await fetch('http://localhost:3001/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error(err);
    }

    setCart([]);
    setDiscount(0);
    setSelectedClient('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-7xl mx-auto">
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
              onClick={() => {
                setShowFastOnly(true);
                setSearchTerm('');
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                showFastOnly && !searchTerm
                  ? 'bg-[#008de4] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Быстрые товары
            </button>
            <button
              onClick={() => {
                setShowFastOnly(false);
                setSearchTerm('');
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                !showFastOnly && !searchTerm
                  ? 'bg-[#008de4] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Все товары
            </button>
          </div>
        <div className="w-[300px]">
          <AddCart onAddToCart={addToCart} />
        </div>
        </div>


        <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product.id)}
                className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-4 rounded-xl transition text-left"
              >
                <p className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {product.price} с
                </p>
                <p className="text-xs text-gray-600 mt-1">{product.category}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:w-96 flex flex-col bg-white rounded-xl border border-gray-200 p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Клиент
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Без клиента</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddClient(!showAddClient)}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Добавить
            </button>
          </div>

          {showAddClient && (
            <div className="mt-2 space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <input
                type="text"
                placeholder="Имя клиента"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Телефон"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleAddClient}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Сохранить
              </button>
            </div>
          )}

          {selectedClient && clientDebt && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
              <p className="font-medium text-gray-900">
                Текущий долг клиента: {clientDebt.amount} сом
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  max={clientDebt.amount}
                  value={debtPayment}
                  onChange={(e) =>
                    setDebtPayment(Math.max(0, Number(e.target.value)))
                  }
                  placeholder="Сумма оплаты долга"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => {
                    if (debtPayment > 0) {
                      payDebt(selectedClient, debtPayment, 'cash');
                      setDebtPayment(0);
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Оплатить долг
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  min={0}
                  value={newDebtAmount}
                  onChange={(e) =>
                    setNewDebtAmount(Math.max(0, Number(e.target.value)))
                  }
                  placeholder="Добавить долг"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => {
                    if (newDebtAmount > 0) {
                      addDebt(selectedClient, newDebtAmount, 'Продажа в долг');
                      setNewDebtAmount(0);
                    }
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Добавить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Корзина и итоги */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Корзина пуста</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-900 flex-1">
                    {item.productName}
                  </p>
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
                  <p className="font-bold text-blue-600">
                    {item.price * item.qty} с
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Скидка и итоги */}
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-gray-400" />
            <input
              type="number"
              min={0}
              max={subtotal}
              value={discount}
              onChange={(e) =>
                setDiscount(Math.max(0, parseFloat(e.target.value) || 0))
              }
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
              disabled={!cart.length}
              className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Banknote className="w-5 h-5" />
              Наличные
            </button>
            <button
              onClick={() => setShowQRModal(true)}
              disabled={!cart.length}
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
