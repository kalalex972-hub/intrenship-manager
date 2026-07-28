// ============================================================
// components/charts/MonthlyChart.jsx
// Bar chart: Applications per month (last 12 months)
// Uses Chart.js via react-chartjs-2
// ============================================================

import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyChart = ({ data = [] }) => {
  const { isDark } = useTheme();

  const gridColor  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const labelColor = isDark ? '#9ca3af' : '#6b7280';

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Applications',
        data: data.map((d) => d.count),
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#fff',
        titleColor: isDark ? '#f9fafb' : '#111827',
        bodyColor: isDark ? '#9ca3af' : '#6b7280',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.raw} application${ctx.raw !== 1 ? 's' : ''}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: labelColor, font: { size: 11 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: labelColor, font: { size: 11 }, stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        No monthly data available yet.
      </div>
    );
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyChart;
