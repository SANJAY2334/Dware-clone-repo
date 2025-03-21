import { useState, useEffect } from "react";

const DBRuns = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/comparisons/db");
        const result = await response.json();
        console.log("Fetched Data:", result);

        if (Array.isArray(result.results)) {
          setData(result.results);
        } else if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Unexpected API response format:", result);
        }
      } catch (error) {
        console.error("Error fetching DB comparison runs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900">Results – DB Runs</h2>

      {/* Table */}
      <div className="mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date and Time</th>
              <th className="p-3 text-left">Run Type</th>
              <th className="p-3 text-center">View Report</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="border-t hover:bg-gray-100 transition">
                  <td className="p-3">{row.name || "N/A"}</td>
                  <td className="p-3">{row.status || "N/A"}</td>
                  <td className="p-3">{row.dateTime || "N/A"}</td>
                  <td className="p-3">{row.runType || "N/A"}</td>
                  <td className="p-3 text-center">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                      View Report
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DBRuns;
