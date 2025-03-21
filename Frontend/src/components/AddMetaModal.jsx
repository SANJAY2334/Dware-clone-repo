import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const AddMetaModal = ({ showModal, onClose, onSave, newMeta, handleChange }) => {
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-xl font-bold text-gray-900">Add Meta Comparison</h3>
          <FaTimes className="text-gray-600 cursor-pointer hover:text-gray-800" onClick={onClose} />
        </div>

        {/* Modal Body */}
        <div className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name*</label>
            <input 
              type="text" 
              name="name" 
              value={newMeta.name} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter meta comparison name"
            />
          </div>

          {/* Source Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Source Type*</label>
            <select 
              name="sourceType" 
              value={newMeta.sourceType} 
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

          {/* Source Type Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Source Type Name</label>
            <input 
              type="text" 
              name="sourceTypeName" 
              value={newMeta.sourceTypeName} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter source type name"
            />
          </div>

          {/* Target Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Target Type*</label>
            <select 
              name="targetType" 
              value={newMeta.targetType} 
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

          {/* Target Type Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Target Type Name</label>
            <input 
              type="text" 
              name="targetTypeName" 
              value={newMeta.targetTypeName} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter target type name"
            />
          </div>

          {/* Target Table */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Target Table</label>
            <input 
              type="text" 
              name="targetTable" 
              value={newMeta.targetTable} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter target table"
            />
          </div>

          {/* Comments */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Comments</label>
            <textarea 
              name="Comments" 
              value={newMeta.Comments} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Add comments (optional)"
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

export default AddMetaModal;
