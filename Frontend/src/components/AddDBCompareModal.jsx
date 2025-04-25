import React, { useEffect, useState } from "react";

const AddDBCompareModal = ({ isOpen, onClose, onSave, editData = null }) => {
  const initialForm = {
    comparisonName: "",
    comparisonType: [],
    sourceType: "",
    sourceName: "",
    sourceDtlId: "",
    targetType: "",
    targetName: "",
    targetDtlId: "",
    createdBy: "",
    updatedBy: "",
    comment: "",
  };

  const [form, setForm] = useState(initialForm);
  const [sourceConnections, setSourceConnections] = useState([]);
  const [targetConnections, setTargetConnections] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "sourceType") {
      setForm((prev) => ({
        ...prev,
        sourceType: value,
        sourceName: "",
        sourceDtlId: "",
      }));
      fetchConnections(value, "source");
    } else if (name === "targetType") {
      setForm((prev) => ({
        ...prev,
        targetType: value,
        targetName: "",
        targetDtlId: "",
      }));
      fetchConnections(value, "target");
    } else if (name === "sourceName") {
      const selected = sourceConnections.find((conn) => conn.name === value);
      setForm((prev) => ({
        ...prev,
        sourceName: value,
        sourceDtlId: selected?.dtl_ID || "",
      }));
    } else if (name === "targetName") {
      const selected = targetConnections.find((conn) => conn.name === value);
      setForm((prev) => ({
        ...prev,
        targetName: value,
        targetDtlId: selected?.dtl_ID || "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  

  const fetchConnections = async (type, side) => {
    const formData = new FormData();
    formData.append("Mst_ID", 40);

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
      const filtered = data.filter((conn) => conn.dataSourceType === "SQL");

      if (side === "source") setSourceConnections(filtered);
      else setTargetConnections(filtered);
    } catch (error) {
      console.error("❌ Error fetching connections:", error);
      if (side === "source") setSourceConnections([]);
      else setTargetConnections([]);
    }
  };

  const handleSubmit = async () => {
    const {
      comparisonName,
      comparisonType,
      sourceDtlId,
      targetDtlId,
      comment,
    } = form;

    if (!comparisonName || !comparisonType.length || !sourceDtlId || !targetDtlId) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      CaseName: comparisonName,
      CompType: comparisonType.join(", "),
      SourceDtlID: Number(sourceDtlId),
      TargetDtlID: Number(targetDtlId),
      SourceID: 1,
      TargetID: 1,
      comments: comment || null,
      Id: 0,
    };

    try {
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/Compare/InsertDBCompare",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("❌ Failed to save DB Compare");

      const result = await response.json();
      console.log("✅ DB Compare saved:", result);
      onSave(result);
      resetForm();
      onClose();
    } catch (error) {
      console.error("❌ Error saving DB Compare:", error);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setSourceConnections([]);
    setTargetConnections([]);
  };

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setForm(editData);
        fetchConnections(editData.sourceType, "source");
        fetchConnections(editData.targetType, "target");
      } else {
        resetForm();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-opacity-30 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
        <h3 className="text-xl font-semibold mb-6 text-center">
          {editData ? "Edit DB Comparison" : "Add New DB Comparison"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="comparisonName"
            placeholder="Comparison Name"
            value={form.comparisonName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Comparison Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {[
                "Table", "Stored Procedure", "User/Roles", "Schema",
                "Trigger", "Views", "Functions", "Synonyms"
              ].map((type) => (
                <label key={type} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    value={type}
                    checked={form.comparisonType.includes(type)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        comparisonType: e.target.checked
                          ? [...prev.comparisonType, value]
                          : prev.comparisonType.filter((item) => item !== value),
                      }));
                    }}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <select
            name="sourceType"
            value={form.sourceType}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Source Type</option>
            <option value="SQL">SQL</option>
          </select>

          <select
            name="sourceName"
            value={form.sourceName}
            onChange={handleChange}
            className="border p-2 rounded"
            disabled={!sourceConnections.length}
          >
            <option value="">Select Source Name</option>
            {sourceConnections.map((conn) => (
              <option key={conn.dtl_ID} value={conn.name}>
                {conn.name}
              </option>
            ))}
          </select>

          <select
            name="targetType"
            value={form.targetType}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Target Type</option>
            <option value="SQL">SQL</option>
          </select>

          <select
            name="targetName"
            value={form.targetName}
            onChange={handleChange}
            className="border p-2 rounded"
            disabled={!targetConnections.length}
          >
            <option value="">Select Target Name</option>
            {targetConnections.map((conn) => (
              <option key={conn.dtl_ID} value={conn.name}>
                {conn.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="createdBy"
            placeholder="Created By"
            value={form.createdBy}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="updatedBy"
            placeholder="Updated By"
            value={form.updatedBy}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <textarea
          name="comment"
          placeholder="Comment"
          value={form.comment}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-4"
          rows={3}
        />

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDBCompareModal;
