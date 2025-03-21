import React, { useState } from "react";

const AddQueryModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    sourceType: "",
    sourceName: "",
    function: "",
    queryName: "",
    query: "",
    createdBy: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.sourceType || !formData.sourceName || !formData.queryName || !formData.query || !formData.createdBy) {
      alert("Please fill in all required fields.");
      return;
    }

    onSave(formData);
    setFormData({
      sourceType: "",
      sourceName: "",
      function: "",
      queryName: "",
      query: "",
      createdBy: "",
    });

    onClose();
  };

  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 transition-transform transform scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add Query</h2>
          <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
            <select
              name="sourceName"
              value={formData.sourceName}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="SQL_Data_string">SQL_Data_string</option>
              <option value="Postgre_SQL_Data_str">Postgre_SQL_Data_str</option>
              <option value="MySQL_Data_string">MySQL_Data_string</option>
              <option value="Oracle_Data_string">Oracle_Data_string</option>
              <option value="SnowFlake_Data_string">SnowFlake_Data_string</option>
            </select>
          </div>

          {/* Query Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Query Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="queryName"
              value={formData.queryName}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          </div>

          {/* Function */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Function <span className="text-red-500">*</span>
            </label>
            <select
              name="function"
              value={formData.function}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="count">Count</option>
              <option value="Duplicate">Duplicate</option>
              <option value="Data Validation">Data Validation</option>
              <option value="Others">Others</option>
            </select>
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

          {/* Query */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Query <span className="text-red-500">*</span>
            </label>
            <textarea
              name="query"
              value={formData.query}
              className="w-full h-40 p-2 border rounded"
              onChange={handleChange}
              required
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

export default AddQueryModal;
