import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
);

const BarChartComponent = ({ title, data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-center mt-10">No data available</p>;
  }

  const firstItem = data[0];
  if (!firstItem) return null;

  const xKey = Object.keys(firstItem).find((key) =>
    key.toLowerCase().includes("category") || key.toLowerCase().includes("pattern")
  );

  if (!xKey) return <p className="text-gray-400 text-center mt-10">Invalid data format</p>;

  const yKeys = Object.keys(firstItem).filter((key) => key !== xKey);

  const labels = data.map((item) => item[xKey]);

  const datasets = yKeys.map((key, idx) => ({
    label: key,
    data: data.map((item) => item[key]),
    backgroundColor: ["#60A5FA", "#F87171", "#34D399", "#FBBF24"][idx % 4],
    borderRadius: 6,
  }));

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 10,
            weight: "bold",
          },
        },
      },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#333",
        font: {
          size: 10,
          weight: "bold",
        },
        padding: 4,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xKey,
          font: {
            size: 12,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 10,
            weight: "bold",
          },
        },
        grid: {
          display: true,
          color: "#E5E7EB",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
          font: {
            size: 12,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            size: 10,
            weight: "bold",
          },
          stepSize: 1,
          padding: 8,
        },
        grid: {
          display: true,
          color: "#E5E7EB",
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h1 className="text-sm font-semibold text-gray-800 mb-4 text-center">
        {title}
      </h1>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChartComponent;
