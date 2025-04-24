import React, { useEffect, useState } from "react";

const AddMetaCompareModal = ({ isOpen, onClose, onSave, editData = null }) => {
  const initialForm = {
    comparisonName: "",
    sourceType: "",
    sourceName: "",
    sourceDtlId: "",
    sourceMstId: "",
    sourceTable: "",
    targetType: "",
    targetName: "",
    targetDtlId: "",
    targetMstId: "",
    targetTable: "",
    comment: "",
  };

  const [form, setForm] = useState(initialForm);
  const [connections, setConnections] = useState({ source: [], target: [] });
  const [tables, setTables] = useState({ source: [], target: [] });

  const fetchConnections = async (side) => {
    const formData = new FormData();
    formData.append("Mst_ID", 40); // Use the fixed Mst_ID as required

    try {
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/DataSource/GetConnection",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      const filtered = Array.isArray(data)
        ? data.filter((conn) => conn.dataSourceType === "SQL")
        : [];

      setConnections((prev) => ({
        ...prev,
        [side]: filtered,
      }));
    } catch (error) {
      console.error("❌ Error fetching connections:", error);
    }
  };

  const fetchTables = async (mstID, dtlID, side) => {
    const payload = { MstID: mstID, DtlID: dtlID };

    try {
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/Compare/GetSchema",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      setTables((prev) => ({
        ...prev,
        [side]: Array.isArray(data?.tableSchema) ? data.tableSchema : [],
      }));
    } catch (error) {
      console.error(`❌ Error fetching ${side} tables:`, error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Type selection (fetch connections)
    if (name === "sourceType" || name === "targetType") {
      const side = name === "sourceType" ? "source" : "target";
      setForm((prev) => ({
        ...prev,
        [name]: value,
        [`${side}Name`]: "",
        [`${side}DtlId`]: "",
        [`${side}MstId`]: "",
        [`${side}Table`]: "",
      }));
      fetchConnections(side);
    }
    // Connection name selection (fetch tables)
    else if (name === "sourceName" || name === "targetName") {
      const side = name === "sourceName" ? "source" : "target";
      const selected = connections[side].find((conn) => conn.name === value);
      const { dtl_ID, mst_ID } = selected || {};
      setForm((prev) => ({
        ...prev,
        [name]: value,
        [`${side}DtlId`]: dtl_ID || "",
        [`${side}MstId`]: mst_ID || "",
        [`${side}Table`]: "",
      }));
      if (dtl_ID && mst_ID) {
        fetchTables(mst_ID, dtl_ID, side);
      }
    }
    // Regular input changes
    else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const {
      comparisonName,
      sourceDtlId,
      targetDtlId,
      sourceTable,
      targetTable,
      comment,
    } = form;

    if (!comparisonName || !sourceDtlId || !targetDtlId || !sourceTable || !targetTable) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      CaseName: comparisonName,
      SourceDtlID: sourceDtlId,
      TargetDtlID: targetDtlId,
      SourceID: 40,
      TargetID: 40,
      SourceTable: sourceTable,
      TargetTable: targetTable,
      comments: comment || null,
      Id: 0,
    };

    try {
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/Compare/InsertMetaCompare",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("❌ Failed to save Meta Compare");

      const result = await response.json();
      console.log("✅ Meta Compare saved:", result);
      onSave(result);
      onClose();
      resetForm();
    } catch (error) {
      console.error("❌ Error saving Meta Compare:", error);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setConnections({ source: [], target: [] });
    setTables({ source: [], target: [] });
  };

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setForm(editData);
        fetchConnections("source");
        fetchConnections("target");
      } else {
        resetForm();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {editData ? "Edit Meta Comparison" : "Add New Meta Comparison"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Comparison Name */}
          <InputField label="Comparison Name" name="comparisonName" value={form.comparisonName} onChange={handleChange} />

          {/* Source Type */}
          <SelectField label="Source Type" name="sourceType" value={form.sourceType} onChange={handleChange}>
            <option value="">Select Source Type</option>
            <option value="SQL">SQL</option>
          </SelectField>

          {/* Source Name */}
          <SelectField label="Source Name" name="sourceName" value={form.sourceName} onChange={handleChange} disabled={!connections.source.length}>
            <option value="">Select Source Name</option>
            {connections.source.map((conn) => (
              <option key={conn.dtl_ID} value={conn.name}>
                {conn.name}
              </option>
            ))}
          </SelectField>

          {/* Source Table */}
          <SelectField label="Source Table" name="sourceTable" value={form.sourceTable} onChange={handleChange} disabled={!tables.source.length}>
            <option value="">Select Source Table</option>
            {tables.source.map((table, idx) => (
              <option key={idx} value={table}>
                {table}
              </option>
            ))}
          </SelectField>

          {/* Target Type */}
          <SelectField label="Target Type" name="targetType" value={form.targetType} onChange={handleChange}>
            <option value="">Select Target Type</option>
            <option value="SQL">SQL</option>
          </SelectField>

          {/* Target Name */}
          <SelectField label="Target Name" name="targetName" value={form.targetName} onChange={handleChange} disabled={!connections.target.length}>
            <option value="">Select Target Name</option>
            {connections.target.map((conn) => (
              <option key={conn.dtl_ID} value={conn.name}>
                {conn.name}
              </option>
            ))}
          </SelectField>

          {/* Target Table */}
          <SelectField label="Target Table" name="targetTable" value={form.targetTable} onChange={handleChange} disabled={!tables.target.length}>
            <option value="">Select Target Table</option>
            {tables.target.map((table, idx) => (
              <option key={idx} value={table}>
                {table}
              </option>
            ))}
          </SelectField>
        </div>

        {/* Comment */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-1">Comment</label>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Write any notes or comments"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable form field components
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, children, disabled }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </select>
  </div>
);

export default AddMetaCompareModal;
