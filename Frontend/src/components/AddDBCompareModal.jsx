import React, { useState } from "react";

const AddDBCompareModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    sourceType: "",
    sourceName: "",
    targetType: "",
    targetName: "",
    createdBy: "",
    comments: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.sourceType || !formData.sourceName || !formData.targetType || !formData.targetName || !formData.createdBy) {
      alert("Please fill in all required fields.");
      return;
    }

    onSave(formData);
    setFormData({
      name: "",
      sourceType: "",
      sourceName: "",
      targetType: "",
      targetName: "",
      createdBy: "",
      comments: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 transition-transform transform scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add DB Comparison</h2>
          <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          </div>

          {/* Source Type */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Source Type <span className="text-red-500">*</span>
            </label>
            <select
              name="sourceType"
              value={formData.sourceType}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="SQL">SQL</option>
              <option value="Postgre SQL">Postgre SQL</option>
              <option value="MySQL">MySQL</option>
              <option value="Oracle">Oracle</option>
              <option value="SnowFlake">SnowFlake</option>
            </select>
          </div>

          {/* Source Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Source Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sourceName"
              value={formData.sourceName}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          </div>

          {/* Target Type */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Target Type <span className="text-red-500">*</span>
            </label>
            <select
              name="targetType"
              value={formData.targetType}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="SQL">SQL</option>
              <option value="Postgre SQL">Postgre SQL</option>
              <option value="MySQL">MySQL</option>
              <option value="Oracle">Oracle</option>
              <option value="SnowFlake">SnowFlake</option>
            </select>
          </div>

          {/* Target Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Target Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="targetName"
              value={formData.targetName}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          </div>

          {/* Created By */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Created By <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="createdBy"
              value={formData.createdBy}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          </div>

          {/* Comments */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              className="w-full h-24 p-2 border rounded"
              onChange={handleChange}
              placeholder="Add comments (optional)"
            ></textarea>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDBCompareModal;
