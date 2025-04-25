import React from "react";
import { Link } from "react-router-dom";

const Comparison = () => {
  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Comparison</h2>
      <div className="flex space-x-4">
        <Link
          to="/comparison/date"
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-500 transition-all"
        >
          Compare by Date
        </Link>
        <Link
          to="/comparison/type"
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-500 transition-all"
        >
          Compare by Type
        </Link>
      </div>
    </div>
  );
};

export default Comparison;
