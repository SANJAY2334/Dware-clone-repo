import React, { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import DropdownButton from "../components/DropdownButton";
import BarChartComponent from "../components/BarChartComponent";
import GraphConfigModal from "../components/GraphConfigModal";
import clientToken from "../../utils/ClientToken";

const ClientDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGraphType, setCurrentGraphType] = useState(null);

  const [graphData, setGraphData] = useState({
    queryRequests:null,
    dataComparisons: null,
    scheduledTasks: null,
  });

  const token = localStorage.getItem("clientToken");

  const handleGenerate = (data) => {
    console.log("Generated graph config:", data);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch("https://dwareautomator.mresult.com/api/users/GetUserDetail", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientToken}`,
          },
        });
        const data = await res.json();
        const user = Array.isArray(data) ? data[0] : data;
        setUserDetails({
          firstName: user.firstName || "Client",
          lastName: user.lastName || "",
          email: user.emailID || "",
          role: user.roleDisplayName || "Client",
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetails();
  }, [token]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientToken}`,
        };

        const fetchGraph = (number) =>
          fetch(`https://dwareautomator.mresult.com/api/dashBoard/GetGraphResult?graphnumber=${number}`, {
            method: "GET",
            headers,
          }).then((res) => res.json());

        const [query, comparison, tasks] = await Promise.all([
          fetchGraph(1),
          fetchGraph(2),
          fetchGraph(3),
        ]);

        setGraphData({
          queryRequests: query,
          dataComparisons: comparison,
          scheduledTasks: tasks,
        });
      } catch (err) {
        console.error("Error fetching graph data:", err);
      }
    };

    fetchGraphData();
  }, [token]);

  const handleAdd = (label) => {
    setCurrentGraphType(label);
    setIsModalOpen(true);
  };

  const handleEdit = (label) => {
    setCurrentGraphType(label);
    setIsModalOpen(true);
  };

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div>
      {userDetails ? (
        <h1 className="text-3xl font-bold text-gray-700">
          Welcome, {userDetails.firstName} {userDetails.lastName}
        </h1>
      ) : (
        <div className="text-gray-500 mt-4">Loading user info...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        
        <SummaryCard title="Query Requests" count={graphData.queryRequests?.count || 0} color="bg-blue-500 hover:bg-blue-700 duration-200" />
        <SummaryCard title="Data Comparisons" count={graphData.dataComparisons?.count || 0} color="bg-green-500 hover:bg-green-700 duration-200" />
        <SummaryCard title="Scheduled Tasks" count={graphData.scheduledTasks?.count || 0} color="bg-purple-500 hover:bg-purple-700 duration-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          { label: "Query Requests", data: graphData.queryRequests },
          { label: "Data Comparisons", data: graphData.dataComparisons },
          { label: "Scheduled Tasks", data: graphData.scheduledTasks },
        ].map((item) => (
          <div key={item.label} className="bg-white shadow rounded-lg p-4 relative">
            <div className="absolute top-3 right-3">
              <DropdownButton onAdd={() => handleAdd(item.label)} onEdit={() => handleEdit(item.label)} />
            </div>
            {item.data ? (
              <BarChartComponent data={item.data} title={item.label} />
            ) : (
              <p className="text-gray-400 text-center mt-10">Loading...</p>
            )}
          </div>
        ))}
      </div>

      <GraphConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerate}
        graphType={currentGraphType}
      />
    </div>
  );
};

export default ClientDashboard;
