import { ReactNode, useState } from 'react';
import {
  ShoppingCart,
  Package,
  History,
  TrendingUp,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Text,
  BookText,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Tooltip, TooltipTrigger } from './Tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({
  children,
  currentPage,
  onNavigate,
}: LayoutProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'pos',
      label: 'Продажа',
      icon: ShoppingCart,
      roles: ['admin', 'cashier', 'owner'],
    },
    {
      id: 'products',
      label: 'Товары',
      icon: Package,
      roles: ['admin', 'owner'],
    },
    {
      id: 'history',
      label: 'История',
      icon: History,
      roles: ['admin', 'cashier', 'owner'],
    },
    {
      id: 'reports',
      label: 'Отчёты',
      icon: FileText,
      roles: ['admin', 'owner'],
    },
    {
      id: 'analytics',
      label: 'Аналитика',
      icon: TrendingUp,
      roles: ['admin', 'owner'],
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: Settings,
      roles: ['admin', 'cashier', 'owner'],
    },
    {
      id: 'debtBook',
      label: 'Дептер',
      icon: BookText,
      roles: ['admin', 'cashier', 'owner'],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/eldik.png" className="w-10" alt="" />

              <div>
                <h1 className="text-xl font-bold text-gray-900">EldikKassa</h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Mini-Pos система
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleNavigate(item.id)}
                        className={`relative w-12 h-12 flex items-center justify-center rounded-lg transition ${
                          isActive
                            ? 'bg-[#008de4] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={8}
                      className="bg-[#008de4] text-white text-xs rounded px-2 py-1 shadow-lg"
                    >
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block  text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600">
                  {user?.role === 'admin'
                    ? 'Администратор'
                    : user?.role === 'owner'
                    ? 'Владелец'
                    : 'Кассир'}
                </p>
              </div>

              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Выход</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-white w-64 h-full shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
    
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">
                {user?.role === 'admin'
                  ? 'Администратор'
                  : user?.role === 'owner'
                  ? 'Владелец'
                  : 'Кассир'}
              </p>
            </div>


            <div className="p-2 flex-1 overflow-y-auto">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                      isActive
                        ? 'bg-[#008de4] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
              >
                <LogOut className="w-5 h-5" />
                Выход
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
