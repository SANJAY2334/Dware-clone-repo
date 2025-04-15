import React from "react";

const GraphConfigModal = ({ isOpen, onClose, onGenerate, graphType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Generate {graphType}</h2>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Type of Visualization</label>
            <select className="mt-1 w-full border rounded px-3 py-2">
              <option>Select Type of Visualization</option>
              <option>Bar </option>
              <option>Line</option>
              
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Type of Test</label>
            <select className="mt-1 w-full border rounded px-3 py-2">
              <option>Select Test Type</option>
              <option>Compare</option>
              <option>Query Request</option>
              <option>Scheduled Task</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-700">X-Axis</label>
            <select className="mt-1 w-full border rounded px-3 py-2">
              <option>Select X-Axis</option>
              <option>Module</option>
              <option>Time</option>
              <option>Status</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Y-Axis</label>
            <select className="mt-1 w-full border rounded px-3 py-2">
              <option>Select Y-Axis</option>
              <option>Count</option>
              <option>Duration</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={onGenerate}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphConfigModal;
