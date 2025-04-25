import React, { useState, useEffect } from "react";

const GraphConfigModal = ({
  isOpen,
  onClose,
  onGenerate,
  graphType,
}) => {
  const [visualizationType, setVisualizationType] = useState("");
  const [testType, setTestType] = useState("");
  const [xAxisOptions, setXAxisOptions] = useState([]);
  const [yAxisOptions, setYAxisOptions] = useState([]);
  const [selectedXAxis, setSelectedXAxis] = useState("");
  const [selectedYAxis, setSelectedYAxis] = useState("");
  const [visualizationTypes, setVisualizationTypes] = useState([]);
  const [testTypes, setTestTypes] = useState([]);
  const [savedDetails, setSavedDetails] = useState(null);

  const graphNumber = graphType?.split(" ").pop() || "1";
  const token = localStorage.getItem("token");

  const fetchDropdownData = async (payload, setter) => {
    try {
      const res = await fetch(
        "https://dwareautomator.mresult.com/api/dashBoard/DropDown",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const { dropdownList } = await res.json();
      setter(dropdownList);
    } catch (err) {
      console.error("DropDown error:", err);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    setVisualizationType("");
    setTestType("");
    setXAxisOptions([]);
    setYAxisOptions([]);
    setSelectedXAxis("");
    setSelectedYAxis("");
    setSavedDetails(null);

    fetchDropdownData({ category: null, typeTest: null }, setVisualizationTypes);
    fetchDropdownData({ category: null, typeTest: null }, setTestTypes);

    fetch("https://dwareautomator.mresult.com/api/dashBoard/GetGraphDetails", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((all) => {
        const arr = all[`graph${graphNumber}`] || [];
        if (arr.length > 0) {
          const d = arr[0];
          setSavedDetails(d);
          setVisualizationType(d.Visualization || "");
          setTestType(d.GraphType || d.Catergory || "");
          setSelectedXAxis(d.XAxis || "");
          setSelectedYAxis(d.YAxis || "");
        } else {
          console.log(`No config saved for graph${graphNumber}`);
        }
      })
      .catch((e) => console.error("GetGraphDetails error:", e));
  }, [isOpen, graphNumber, token]);

  useEffect(() => {
    if (!testType) return;
    fetchDropdownData({ category: testType, typeTest: null }, (list) => {
      setXAxisOptions(list.filter((i) => i.XAXIS));
      if (!selectedXAxis) setYAxisOptions([]);
    });
  }, [testType]);

  useEffect(() => {
    if (!selectedXAxis) return;
    fetchDropdownData({ category: testType, xaxis: selectedXAxis }, (list) => {
      setYAxisOptions(list.filter((i) => i.YAXIS));
    });
  }, [selectedXAxis]);

  const handleGenerate = async () => {
    const payload = {
      Catergory: testType,
      xaxis: selectedXAxis,
      yaxis: selectedYAxis,
      graphnumber: graphNumber,
      graphtype: graphType,
      visualization: visualizationType,
    };
    try {
      const res = await fetch(
        "https://dwareautomator.mresult.com/api/dashBoard/InsertDashboard",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      console.log("InsertDashboard:", data);
      onGenerate(data);
      onClose();
    } catch (err) {
      console.error("InsertDashboard error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-opacity-30 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Configure {graphType}</h2>
        <div className="space-y-4">
          {/* Visualization Type */}
          <div>
            <label className="block text-gray-700">Visualization</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={visualizationType}
              onChange={(e) => setVisualizationType(e.target.value)}
            >
              <option value="">Select Visualization</option>
              {visualizationTypes.map((vt, i) => (
                <option key={i} value={vt.CATEGORY || vt}>
                  {vt.CATEGORY || vt}
                </option>
              ))}
            </select>
          </div>

          {/* Test Type */}
          <div>
            <label className="block text-gray-700">Test Type</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
            >
              <option value="">Select Test Type</option>
              {testTypes.map((tt, i) => (
                <option key={i} value={tt.CATEGORY || tt}>
                  {tt.CATEGORY || tt}
                </option>
              ))}
            </select>
          </div>

          {/* X-Axis */}
          {xAxisOptions.length > 0 && (
            <div>
              <label className="block text-gray-700">X-Axis</label>
              <select
                className="mt-1 w-full border rounded px-3 py-2"
                value={selectedXAxis}
                onChange={(e) => setSelectedXAxis(e.target.value)}
              >
                <option value="">Select X-Axis</option>
                {xAxisOptions.map((x, i) => (
                  <option key={i} value={x.XAXIS}>
                    {x.XAXIS}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Y-Axis */}
          {yAxisOptions.length > 0 && (
            <div>
              <label className="block text-gray-700">Y-Axis</label>
              <select
                className="mt-1 w-full border rounded px-3 py-2"
                value={selectedYAxis}
                onChange={(e) => setSelectedYAxis(e.target.value)}
              >
                <option value="">Select Y-Axis</option>
                {yAxisOptions.map((y, i) => (
                  <option key={i} value={y.YAXIS}>
                    {y.YAXIS}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
          <button
            onClick={handleGenerate}
            disabled={
              !visualizationType ||
              !testType ||
              !selectedXAxis ||
              !selectedYAxis
            }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphConfigModal;
