import React from "react";

const SummaryCard = ({ title, count, color }) => {
  return (
    <div className={`p-6 rounded-xl shadow-lg flex items-center ${color} text-white`}>
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-4xl font-bold mt-2">{count}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
