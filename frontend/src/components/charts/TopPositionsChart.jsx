// ============================================================
// components/charts/TopPositionsChart.jsx
// Horizontal bar chart: Most applied positions
// ============================================================

import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import { CHART_COLORS } from '../../utils/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopPositionsChart = ({ data = [] }) => {
  const { isDark } = useTheme();

  const labelColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const bgColors = Object.values(CHART_COLORS).slice(0, data.length);

  const chartData = {
    labels: data.map((d) => d.position),
    datasets: [{
      label: 'Applications',
      data: data.map((d) => d.count),
      backgroundColor: bgColors,
      borderRadius: 4,
      borderSkipped: false,
    }],
  };

  const options = {
    indexAxis: 'y',
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
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: labelColor, stepSize: 1 },
        beginAtZero: true,
      },
      y: {
        grid: { display: false },
        ticks: { color: labelColor, font: { size: 11 } },
      },
    },
  };

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        No position data yet.
      </div>
    );
  }

  return (
    <div style={{ height: `${Math.max(200, data.length * 45)}px` }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TopPositionsChart;
