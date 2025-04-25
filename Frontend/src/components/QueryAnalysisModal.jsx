// components/QueryAnalysisModal.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const QueryAnalysisModal = ({ isOpen, onClose, analysisResult }) => {
  if (!isOpen || !analysisResult) return null;

  const data = {
    labels: analysisResult.percentageResults.map((r) => r.testCaseName),
    datasets: [
      {
        label: "Pass",
        data: analysisResult.percentageResults.map((r) => r.passRuns),
        backgroundColor: "#22c55e", // Tailwind green-500
      },
      {
        label: "Fail",
        data: analysisResult.percentageResults.map((r) => r.failRuns),
        backgroundColor: "#ef4444", // Tailwind red-500
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Query Analysis Result",
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-opacity-30 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Query Analysis Result</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl"
          >
            &times;
          </button>
        </div>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default QueryAnalysisModal;
