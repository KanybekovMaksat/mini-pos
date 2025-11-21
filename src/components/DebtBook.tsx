import { useState } from 'react';
import { mockClients, mockDebts, Debt, DebtEntry } from '../data/mockData';

export default function DebtBook() {
  const [debts, setDebts] = useState<Debt[]>(mockDebts);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState('');

  const handleAddDebt = () => {
    if (!selectedClient || amount <= 0) return;

    const newEntry: DebtEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'debt',
      amount,
      comment,
    };

    const existingDebt = debts.find(d => d.clientId === selectedClient);
    if (existingDebt) {
      existingDebt.amount += amount;
      existingDebt.entries.push(newEntry);
      existingDebt.status = 'active';
      setDebts([...debts]);
    } else {
      setDebts([
        ...debts,
        {
          id: Date.now().toString(),
          clientId: selectedClient,
          amount,
          status: 'active',
          entries: [newEntry],
        },
      ]);
    }

    setAmount(0);
    setComment('');
  };

  const handlePayment = (debtId: string, payment: number, type: 'cash' | 'qr') => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;

    const paymentEntry: DebtEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'payment',
      amount: payment,
      paymentType: type,
    };

    debt.entries.push(paymentEntry);
    debt.amount -= payment;
    if (debt.amount <= 0) debt.status = 'closed';
    setDebts([...debts]);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Долговая тетрадь 2.0</h1>

      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h2 className="font-bold mb-2">Добавить долг</h2>
        <select
          value={selectedClient}
          onChange={e => setSelectedClient(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg mb-2"
        >
          <option value="">Выберите клиента</option>
          {mockClients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded-lg mb-2"
        />
        <input
          type="text"
          placeholder="Комментарий"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg mb-2"
        />
        <button
          onClick={handleAddDebt}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Добавить долг
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h2 className="font-bold mb-4">Список долгов</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b px-2 py-1">Клиент</th>
              <th className="border-b px-2 py-1">Долг</th>
              <th className="border-b px-2 py-1">Статус</th>
              <th className="border-b px-2 py-1">Действия</th>
            </tr>
          </thead>
          <tbody>
            {debts.map(d => {
              const client = mockClients.find(c => c.id === d.clientId);
              return (
                <tr key={d.id}>
                  <td className="border-b px-2 py-1">{client?.name}</td>
                  <td className="border-b px-2 py-1">{d.amount} сом</td>
                  <td className="border-b px-2 py-1">{d.status === 'active' ? 'Есть долг' : 'Закрыт'}</td>
                  <td className="border-b px-2 py-1">
                    <button
                      onClick={() => {
                        const pay = Number(prompt('Сумма оплаты:'));
                        if (pay) handlePayment(d.id, pay, 'cash');
                      }}
                      className="bg-green-600 text-white px-2 py-1 rounded-lg mr-2"
                    >
                      Оплатить
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
