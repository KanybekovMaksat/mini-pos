import { useState } from 'react';
import { LogIn, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(email, password)) {
      setError('');
    } else {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl ">
          <img src="https://eldikkassa.ustaz.tech//web.png" className='h-[140px] md:h-[200px] w-full object-cover rounded-t-2xl' alt="" />
          <div className="p-4 md:p-8">

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="admin@minipos.kg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#008de4] text-white py-3 rounded-lg font-semibold hover:bg-[#008de4] transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Войти
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2 font-semibold">
                Тестовые аккаунты:
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  <strong>Админ:</strong> admin@minipos.kg
                </p>
                <p>
                  <strong>Кассир:</strong> cashier@minipos.kg
                </p>
                <p>
                  <strong>Владелец:</strong> owner@minipos.kg
                </p>
                <p>
                  <strong>Пароль:</strong> 1234
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
