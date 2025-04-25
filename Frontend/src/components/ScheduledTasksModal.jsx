// ScheduledTasksModal.jsx
import React, { useEffect, useState } from "react";

const ScheduledTasksModal = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchJobSummary = async () => {
      const token = localStorage.getItem("token"); // Get the token from local storage
      if (!token) {
        console.error("No c token found in local storage");
        return;
      }

      try {
        const response = await fetch(
          `https://dwareautomator.mresult.com/api/schedular/GetJobSummary?category=${filter}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setTasks(data || []);
      } catch (error) {
        console.error("Error fetching job summary:", error);
      }
    };

    if (isOpen) fetchJobSummary();
  }, [isOpen, filter]);

  const renderPagination = () => (
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center space-x-2">
        <button onClick={() => setPage(1)}>&laquo;</button>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>&lsaquo;</button>
        <span className="bg-blue-100 px-3 py-1 rounded">{page}</span>
        <button onClick={() => setPage((p) => p + 1)}>&rsaquo;</button>
        <button onClick={() => setPage((p) => p + 1)}>&raquo;</button>
      </div>
      <select className="border px-2 py-1" defaultValue="10">
        <option>10</option>
        <option>25</option>
        <option>50</option>
      </select>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[80vw] max-w-6xl p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Scheduled Tasks Monitor</h2>
          <div className="space-x-2">
            {["all", "day", "week", "month"].map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 rounded ${filter === cat ? "bg-gray-700 text-white" : "bg-blue-200 text-blue-900"}`}
                onClick={() => setFilter(cat)}
              >
                {cat[0].toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Frequency</th>
                <th className="px-4 py-2 border">Date and Time</th>
                <th className="px-4 py-2 border">Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 border">{idx + 1}</td>
                    <td className="px-4 py-2 border">{task.name}</td>
                    <td className="px-4 py-2 border">{task.type}</td>
                    <td className="px-4 py-2 border">{task.frequency}</td>
                    <td className="px-4 py-2 border">{task.dateTime}</td>
                    <td className="px-4 py-2 border">{task.scheduled ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No scheduled tasks.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {renderPagination()}

        <div className="mt-4 text-right">
          <button onClick={onClose} className="bg-blue-700 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduledTasksModal;
