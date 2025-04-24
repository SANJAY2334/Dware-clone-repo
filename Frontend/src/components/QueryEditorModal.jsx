import React, { useState, useRef } from "react";

const QueryEditorModal = ({
  isOpen,
  onClose,
  onSave,
  initialQuery = "",
  isLoading = false,
  tables = [],
  savedQueries = [],
  attributes = [],
  columns = [],
  procedures = [],
}) => {
  const [queryText, setQueryText] = useState(initialQuery);
  const [selectedQuery, setSelectedQuery] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("");

  const textareaRef = useRef(null); // 👈 Add this

  const insertAtCursor = (text) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated =
      queryText.substring(0, start) + text + queryText.substring(end);
    setQueryText(updated);

    // Maintain cursor position after insert
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
    }, 0);
  };

  const handleSave = () => {
    onSave(queryText);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
        <h3 className="text-xl font-semibold mb-4">Query Editor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Query Input */}
          <div>
            <textarea
              ref={textareaRef}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="w-full h-60 border p-2 rounded resize-none"
              placeholder="Enter your query here..."
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter multiple queries separated by pipe symbol.
            </p>
          </div>

          {/* Right Side: Dropdowns */}
          <div className="space-y-4">
            <Dropdown
              label="Select Saved Query"
              value={selectedQuery}
              options={savedQueries}
              onChange={setSelectedQuery}
            />
            <Dropdown
              label="Select Attribute"
              value={selectedAttribute}
              options={attributes}
              onChange={(value) => {
                setSelectedAttribute(value);
                insertAtCursor(value + " ");
              }}
            />
            <Dropdown
              label="Select Tables"
              value={selectedTable}
              options={tables}
              onChange={setSelectedTable}
              isLoading={isLoading}
            />
            <Dropdown
              label="Select Columns"
              value={selectedColumn}
              options={columns}
              onChange={setSelectedColumn}
            />
            <Dropdown
              label="Select Procedure"
              value={selectedProcedure}
              options={procedures}
              onChange={setSelectedProcedure}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable dropdown component
const Dropdown = ({ label, value, options, onChange, isLoading }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border p-2 rounded bg-white"
    >
      <option value="">
        {isLoading ? "Loading data. Please wait..." : `Select ${label}`}
      </option>
      {!isLoading &&
        options.map((opt, idx) => (
          <option key={idx} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
    </select>
  </div>
);

export default QueryEditorModal;
