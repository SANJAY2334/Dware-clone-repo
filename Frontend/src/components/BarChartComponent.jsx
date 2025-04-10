import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChartComponent = ({ title, data }) => {
  const labels = Object.keys(data || {});
  const values = Object.values(data || {});

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: "#3B82F6", // Tailwind blue-500
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default BarChartComponent;
