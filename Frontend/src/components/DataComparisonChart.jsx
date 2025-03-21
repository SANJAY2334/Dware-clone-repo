import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DataComparisonChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  // Convert API data into Recharts-compatible format
  const chartData = Object.entries(data).map(([type, comparisons]) => ({
    type,
    comparisons: Number(comparisons) || 0, // Ensure it's a number
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-lg font-bold text-gray-700 mb-3">Data Comparison By Type</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="type" label={{ value: "Category", position: "insideBottom", dy: 10 }} />
          <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="comparisons" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataComparisonChart;
