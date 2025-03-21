import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const AddCompareModal = ({ showModal, onClose, onSave, newComparison, handleChange }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when closed
    }

    return () => {
      document.body.style.overflow = "auto"; // Reset when unmounted
    };
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-xl font-bold text-gray-900">Add Comparison</h3>
          <FaTimes className="text-gray-600 cursor-pointer hover:text-gray-800" onClick={onClose} />
        </div>

        {/* Modal Body */}
        <div className="mt-4 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name*</label>
            <input 
              type="text" 
              name="name" 
              value={newComparison.name} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter comparison name"
            />
          </div>

          {/* Source Type Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Source Type*</label>
            <select 
              name="sourceType" 
              value={newComparison.sourceType} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="">Select</option>
              <option value="SQL">SQL</option>
              <option value="SnowFlake">SnowFlake</option>
              <option value="Excel">Excel</option>
              <option value="CSV">CSV</option>
            </select>
          </div>

          {/* Target Type Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Target Type*</label>
            <select 
              name="targetType" 
              value={newComparison.targetType} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="">Select</option>
              <option value="SQL">SQL</option>
              <option value="SnowFlake">SnowFlake</option>
              <option value="Excel">Excel</option>
              <option value="CSV">CSV</option>
            </select>
          </div>

          {/* Unique Key Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Unique Key for Comparison*</label>
            <input 
              type="text" 
              name="uniqueKey" 
              value={newComparison.uniqueKey} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter unique key"
            />
          </div>

          {/* Columns Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Columns for Comparison*</label>
            <input 
              type="text" 
              name="columns" 
              value={newComparison.columns} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="e.g., Id;FirstName;LastName"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onSave} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompareModal;
