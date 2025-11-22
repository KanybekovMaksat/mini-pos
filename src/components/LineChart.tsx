import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Receipt } from '../data/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  receipts: Receipt[];
  period?: 'day' | 'week' | 'month';
}

const RevenueBarChart: FC<BarChartProps> = ({ receipts, period = 'week' }) => {
  const now = new Date();

  // --- фильтруем чеки по статусу "paid" ---
  const periodReceipts = receipts.filter(r => r.status === 'paid');

  // --- группируем выручку по дням ---
  const dailyRevenue = new Map<string, number>();
  periodReceipts.forEach(receipt => {
    const d = new Date(receipt.createdAt);
    const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    dailyRevenue.set(dateStr, (dailyRevenue.get(dateStr) || 0) + receipt.total);
  });

  const daysCount = period === 'day' ? 1 : period === 'week' ? 7 : 30;
  const labels: string[] = [];
  const data: number[] = [];

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    labels.push(d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }));
    data.push(dailyRevenue.get(dateStr) || 0);
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Выручка, с',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 6, 
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(0)} с`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return<div style={{ width: '100%', height: '300px' }}>
  <Bar
    data={{
      labels: labels,
      datasets: [
        {
          label: 'Выручка, с',
          data: data,
          backgroundColor: 'rgba(59,130,246,0.7)',
          borderRadius: 6,
        },
      ],
    }}
    options={{
      responsive: true,
      maintainAspectRatio: false, // важно для Telegram
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `${ctx.parsed.y.toFixed(0)} с`,
          },
        },
      },
      scales: { y: { beginAtZero: true } },
    }}
  />
</div>;
};

export default RevenueBarChart;
