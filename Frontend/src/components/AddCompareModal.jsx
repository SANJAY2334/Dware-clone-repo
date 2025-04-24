import React, { useState } from "react";

const AddCompareModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: [], // Multi-select as an array
    sourceType: "",
    sourceName: "",
    targetType: "",
    targetName: "",
    createdBy: "",
    updatedBy: "",
    comments: "",
  });

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle checkbox selection
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value] // Add selected value
          : prev[name].filter((item) => item !== value), // Remove unselected value
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    // Validation: Ensure required fields are filled
    const requiredFields = [
      "name",
      "type",
      "sourceType",
      "sourceName",
      "targetType",
      "targetName",
      "createdBy",
      "updatedBy",
    ];
    for (let field of requiredFields) {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        setError("Please fill in all required fields.");
        return;
      }
    }

    if (typeof onSave === "function") {
      onSave(formData);
    } else {
      console.error("onSave is not a function");
      return;
    }

    // Reset form
    setFormData({
      name: "",
      type: [],
      sourceType: "",
      sourceName: "",
      targetType: "",
      targetName: "",
      createdBy: "",
      updatedBy: "",
      comments: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full h-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add DATA Comparison</h2>
          <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Text Input Fields */}
          {[
            { label: "Name", name: "name" },
            { label: "Source Name", name: "sourceName" },
            { label: "Target Name", name: "targetName" },
            { label: "Created By", name: "createdBy" },
            { label: "Updated By", name: "updatedBy" },
          ].map((field) => (
            <div className="mb-4" key={field.name}>
              <label className="block text-gray-700 font-medium">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Type (Multiple Select as Checkboxes) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                "Function",
                "Stored Procedure",
                "User/Role",
                "Schema",
                "Triggers",
                "View",
                "Tables",
                "Synonyms",
              ].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    name="type"
                    value={option}
                    checked={formData.type.includes(option)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>

            {/* Display selected options */}
            <p className="mt-2 text-gray-700">
              Selected: {formData.type.length > 0 ? formData.type.join(", ") : "None"}
            </p>
          </div>

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
                <option value="CSV">CSV</option>
                <option value="Excel">Excel</option>
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

export default AddCompareModal;
