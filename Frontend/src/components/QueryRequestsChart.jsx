import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const QueryRequestsChart = ({ data = {} }) => {
  // Ensure data is in object format
  const formattedData = typeof data === "object" && data !== null ? data : {};

  const chartData = {
    labels: Object.keys(formattedData).length ? Object.keys(formattedData) : ["No Data"],
    datasets: [
      {
        label: "Query Requests",
        data: Object.keys(formattedData).length ? Object.values(formattedData) : [0],
        backgroundColor: ["#3b82f6", "#10b981", "#6366f1", "#f59e0b"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { drawBorder: false },
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl">
      <h2 className="text-lg font-bold text-gray-700 mb-3">Query Requests By Sources</h2>
      <div className="h-64">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default QueryRequestsChart;
