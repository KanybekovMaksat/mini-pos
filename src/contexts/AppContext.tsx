import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Receipt, mockProducts, mockReceipts, mockClients, Client } from '../data/mockData';

interface AppContextType {
  products: Product[];
  receipts: Receipt[];
  clients: Client[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addReceipt: (receipt: Omit<Receipt, 'id'>) => void;
  cancelReceipt: (id: string, reason: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('minipos_products');
    return saved ? JSON.parse(saved) : mockProducts;
  });

  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    const saved = localStorage.getItem('minipos_receipts');
    return saved ? JSON.parse(saved) : mockReceipts;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('minipos_clients');
    return saved ? JSON.parse(saved) : mockClients;
  });

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem('minipos_products', JSON.stringify(updated));
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...product } : p);
    setProducts(updated);
    localStorage.setItem('minipos_products', JSON.stringify(updated));
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('minipos_products', JSON.stringify(updated));
  };

  const addReceipt = (receipt: Omit<Receipt, 'id'>) => {
    const newReceipt = {
      ...receipt,
      id: (1000 + receipts.length + 1).toString()
    };
    const updated = [newReceipt, ...receipts];
    setReceipts(updated);
    localStorage.setItem('minipos_receipts', JSON.stringify(updated));
  };

  const cancelReceipt = (id: string, reason: string) => {
    const updated = receipts.map(r =>
      r.id === id ? { ...r, status: 'cancelled' as const, cancelReason: reason } : r
    );
    setReceipts(updated);
    localStorage.setItem('minipos_receipts', JSON.stringify(updated));
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = { ...client, id: Date.now().toString() };
    const updated = [...clients, newClient];
    setClients(updated);
    localStorage.setItem('minipos_clients', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{
      products,
      receipts,
      clients,
      addProduct,
      updateProduct,
      deleteProduct,
      addReceipt,
      cancelReceipt,
      addClient
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
