export type Role = 'admin' | 'cashier' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  pointId: string;
  telegramChatId?: string;
}

export interface Point {
  id: string;
  name: string;
  address: string;
}

export interface Product {
  id: string;
  pointId: string;
  name: string;
  price: number;
  category: string;
  isFastProduct: boolean;
  imageUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  notes?: string;
}

export interface ReceiptItem {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  price: number;
}

export interface Receipt {
  id: string;
  pointId: string;
  cashierId: string;
  cashierName: string;
  clientId?: string;
  clientName?: string;
  items: ReceiptItem[];
  total: number;
  discount: number;
  paymentType: 'cash' | 'qr';
  status: 'paid' | 'cancelled';
  createdAt: string;
  cancelReason?: string;
}

export interface Expense {
  id: string;
  pointId: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface CashBalance {
  id: string;
  pointId: string;
  startBalance: number;
  endBalance: number;
  date: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Алия Иманова',
    email: 'admin@minipos.kg',
    role: 'admin',
    pointId: '1',
    telegramChatId: '123456789'
  },
  {
    id: '2',
    name: 'Бекет Асанов',
    email: 'cashier@minipos.kg',
    role: 'cashier',
    pointId: '1'
  },
  {
    id: '3',
    name: 'Гульнара Токтогулова',
    email: 'owner@minipos.kg',
    role: 'owner',
    pointId: '1',
    telegramChatId: '987654321'
  }
];

export const mockPoints: Point[] = [
  {
    id: '1',
    name: 'Магазин "Ак-Орго"',
    address: 'г. Бишкек, ул. Чуй 123'
  },
  {
    id: '2',
    name: 'Магазин "Ак-Орго 2"',
    address: 'г. Бишкек, ул. Московская 45'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    pointId: '1',
    name: 'Хлеб белый',
    price: 30,
    category: 'Хлебобулочные',
    isFastProduct: true
  },
  {
    id: '2',
    pointId: '1',
    name: 'Молоко 1л',
    price: 65,
    category: 'Молочные',
    isFastProduct: true
  },
  {
    id: '3',
    pointId: '1',
    name: 'Яйца 10шт',
    price: 120,
    category: 'Продукты',
    isFastProduct: false
  },
  {
    id: '4',
    pointId: '1',
    name: 'Масло подсолнечное 1л',
    price: 150,
    category: 'Продукты',
    isFastProduct: false
  },
  {
    id: '5',
    pointId: '1',
    name: 'Чай черный',
    price: 85,
    category: 'Напитки',
    isFastProduct: true
  },
  {
    id: '6',
    pointId: '1',
    name: 'Сахар 1кг',
    price: 70,
    category: 'Продукты',
    isFastProduct: false
  },
  {
    id: '7',
    pointId: '1',
    name: 'Мука 1кг',
    price: 50,
    category: 'Продукты',
    isFastProduct: false
  },
  {
    id: '8',
    pointId: '1',
    name: 'Вода 1.5л',
    price: 25,
    category: 'Напитки',
    isFastProduct: true
  }
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Азамат Калыков',
    phone: '+996555123456',
    notes: 'Постоянный клиент'
  },
  {
    id: '2',
    name: 'Динара Саматова',
    phone: '+996777987654',
    notes: 'VIP клиент'
  }
];

export const mockReceipts: Receipt[] = [
  {
    id: '1001',
    pointId: '1',
    cashierId: '2',
    cashierName: 'Бекет Асанов',
    items: [
      { id: '1', productId: '1', productName: 'Хлеб белый', qty: 2, price: 30 },
      { id: '2', productId: '2', productName: 'Молоко 1л', qty: 1, price: 65 }
    ],
    total: 125,
    discount: 0,
    paymentType: 'cash',
    status: 'paid',
    createdAt: new Date().toISOString()
  },
  {
    id: '1002',
    pointId: '1',
    cashierId: '2',
    cashierName: 'Бекет Асанов',
    clientId: '1',
    clientName: 'Азамат Калыков',
    items: [
      { id: '1', productId: '5', productName: 'Чай черный', qty: 3, price: 85 },
      { id: '2', productId: '8', productName: 'Вода 1.5л', qty: 4, price: 25 }
    ],
    total: 355,
    discount: 10,
    paymentType: 'qr',
    status: 'paid',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    pointId: '1',
    amount: 5000,
    description: 'Аренда помещения',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    pointId: '1',
    amount: 1200,
    description: 'Коммунальные услуги',
    createdAt: new Date(Date.now() - 43200000).toISOString()
  }
];

export const mockCashBalance: CashBalance = {
  id: '1',
  pointId: '1',
  startBalance: 10000,
  endBalance: 14280,
  date: new Date().toISOString()
};
