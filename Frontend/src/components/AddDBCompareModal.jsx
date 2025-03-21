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

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    // Validation: Ensure required fields are filled
    const requiredFields = ["name", "sourceType", "sourceName", "targetType", "targetName", "createdBy"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError("Please fill in all required fields.");
        return;
      }
    }

    // Check if onSave is a valid function before calling it
    if (typeof onSave === "function") {
      onSave(formData);
    } else {
      console.error("onSave is not a function");
      return;
    }

    // Reset form and close modal after successful save
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity animate-fadeIn">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 transform transition-transform animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add DB Comparison</h2>
          <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Source Name", name: "sourceName", type: "text" },
            { label: "Target Name", name: "targetName", type: "text" },
            { label: "Created By", name: "createdBy", type: "text" },
          ].map((field) => (
            <div className="mb-4" key={field.name}>
              <label className="block text-gray-700 font-medium">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Select Fields */}
          {[
            { label: "Source Type", name: "sourceType" },
            { label: "Target Type", name: "targetType" },
          ].map((field) => (
            <div className="mb-4" key={field.name}>
              <label className="block text-gray-700 font-medium">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <select
                name={field.name}
                value={formData[field.name]}
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
          ))}

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

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDBCompareModal;
