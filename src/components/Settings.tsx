import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Store,
  Moon,
  Sun,
  Plus,
  UserRoundPlus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  mockPoints,
  mockUsers,
  User as UserType,
  Role,
} from '../data/mockData';

export default function Settings() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [telegramChatId, setTelegramChatId] = useState(
    user?.telegramChatId || ''
  );

  const canManageSettings = user?.role === 'admin' || user?.role === 'owner';

  const [newCashierName, setNewCashierName] = useState('');
  const [newCashierEmail, setNewCashierEmail] = useState('');
  const [newCashierPointId, setNewCashierPointId] = useState(
    user?.pointId || ''
  );
  const [users, setUsers] = useState<UserType[]>(mockUsers);

  const handleAddCashier = () => {
    if (!newCashierName || !newCashierEmail || !newCashierPointId) return;

    const newUser: UserType = {
      id: (users.length + 1).toString(),
      name: newCashierName,
      email: newCashierEmail,
      role: 'cashier',
      pointId: newCashierPointId,
    };

    setUsers([...users, newUser]);
    setNewCashierName('');
    setNewCashierEmail('');
    setNewCashierPointId(user?.pointId || '');
    alert('Кассир добавлен');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Настройки</h1>
        <p className="text-gray-600 text-sm">
          Управление системой и настройками
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Профиль</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Роль
              </label>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium text-sm">
                  {user?.role === 'admin'
                    ? 'Администратор'
                    : user?.role === 'owner'
                    ? 'Владелец'
                    : 'Кассир'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <Store className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Точка продаж</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название
              </label>
              <input
                type="text"
                value={
                  mockPoints.find((p) => p.id === user?.pointId)?.name || ''
                }
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адрес
              </label>
              <input
                type="text"
                value={
                  mockPoints.find((p) => p.id === user?.pointId)?.address || ''
                }
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* {canManageSettings && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Уведомления Telegram</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Уведомления</p>
                  <p className="text-sm text-gray-600">Получать уведомления о новых чеках</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-12 h-6 rounded-full transition ${
                    notifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                    notifications ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telegram Chat ID
                </label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="123456789"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Получите свой Chat ID от @userinfobot в Telegram
                </p>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Сохранить настройки
              </button>
            </div>
          </div>
        )} */}

        {/* <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-2 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Внешний вид</h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-600" />
              )}
              <div>
                <p className="font-medium text-gray-900">Тёмная тема</p>
                <p className="text-sm text-gray-600">Изменить цветовую схему</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition transform ${
                darkMode ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>
        </div> */}

        <div className="max-w-4xl mx-auto">
          {canManageSettings && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-200 p-2 rounded-lg">
                  <UserRoundPlus className='text-green-600' />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Добавить кассира
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={newCashierName}
                    onChange={(e) => setNewCashierName(e.target.value)}
                    placeholder="Введите имя"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newCashierEmail}
                    onChange={(e) => setNewCashierEmail(e.target.value)}
                    placeholder="Введите email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Точка продаж
                  </label>
                  <select
                    value={newCashierPointId}
                    onChange={(e) => setNewCashierPointId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {mockPoints.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddCashier}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Добавить кассира
                </button>
              </div>
              {/* Список кассиров */}
              {canManageSettings && (
                <div className="bg-white  rounded-xl  mt-5">
                  <h2 className="text-xl font-bold mb-4">Список кассиров</h2>
                  <ul className="space-y-3">
                    {users
                      .filter((u) => u.role === 'cashier')
                      .map((cashier) => (
                        <li
                          key={cashier.id}
                          className="p-3 border border-gray-200 rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{cashier.name}</p>
                            <p className="text-sm text-gray-600">
                              {cashier.email}
                            </p>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            Кассир
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {canManageSettings && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Роли и доступ
                </h2>
              </div>

              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      Администратор
                    </h3>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      Полный доступ
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Управление товарами, отчётами, сотрудниками, историей и
                    аналитикой
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Кассир</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Ограниченный
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Создание чеков и просмотр истории продаж
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Владелец</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Полный доступ
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Полный доступ ко всем данным и возможность подключить
                    Telegram
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
