// ============================================================
// components/charts/StatusPieChart.jsx
// Doughnut chart: Applications breakdown by status
// ============================================================

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_CHART_COLORS } from '../../utils/constants';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusPieChart = ({ stats = {} }) => {
  const { isDark } = useTheme();

  const labels  = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];
  const values  = [stats.pending || 0, stats.reviewed || 0, stats.accepted || 0, stats.rejected || 0];
  const colors  = [
    STATUS_CHART_COLORS.pending,
    STATUS_CHART_COLORS.reviewed,
    STATUS_CHART_COLORS.accepted,
    STATUS_CHART_COLORS.rejected,
  ];

  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderColor: isDark ? '#1f2937' : '#fff',
      borderWidth: 3,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#9ca3af' : '#6b7280',
          padding: 16,
          font: { size: 12 },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#fff',
        titleColor: isDark ? '#f9fafb' : '#111827',
        bodyColor: isDark ? '#9ca3af' : '#6b7280',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : 0;
            return ` ${ctx.raw} (${pct}%)`;
          },
        },
      },
    },
  };

  const hasData = values.some((v) => v > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        No applications yet.
      </div>
    );
  }

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default StatusPieChart;
