import React, { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import BarChartComponent from "../components/BarChartComponent";

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState({
    graph1: [],
    graph2: [],
    graph3: [],
  });

  const token = localStorage.getItem("token");

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(
        "https://dwareautomator.mresult.com/api/users/GetUserDetail",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const fetchTestCaseData = async () => {
    const token = localStorage.getItem("token"); 
  
    if (!token) {
      console.error("Token not found");
      return;
    }
  
    try {
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/TestCase/GetTestCase",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Use the token for authentication
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch test case data");
      }
  
      const data = await response.json();
      console.log("Test case data:", data); // Log the fetched data or use it as needed
  
      // Handle the fetched data here
      // You can set the data to a state or perform other operations
  
    } catch (error) {
      console.error("Error fetching test case data:", error.message);
    }
  };
  
  const fetchGraphData = async () => {
    try {
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/dashBoard/GetGraphDetails",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch graph details");

      const result = await response.json();
      console.log(result);
      setGraphData({
        
        graph1: result.graph1 || [],
        graph2: result.graph2 || [],
        graph3: result.graph3 || [],
      });
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

    

  useEffect(() => {
    if (token) {
      fetchUserDetails();
      fetchGraphData();
      fetchTestCaseData();
    }
  }, [token]);

  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

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
        <SummaryCard
          title="Query Requests"
          count={graphData.graph1.length}
          color="bg-blue-500 hover:bg-blue-700 duration-200"
        />
        <SummaryCard
          title="Data Comparisons"
          count={graphData.graph2.length}
          color="bg-green-500 hover:bg-green-700 duration-200"
        />
        <SummaryCard
          title="Scheduled Tasks"
          count={graphData.graph3.length}
          color="bg-purple-500 hover:bg-purple-700 duration-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
        {[1, 2, 3].map((graphNumber) => {
          const graphResult = graphData[`graph${graphNumber}`];

          return (
            <div
              key={graphNumber}
              className="bg-white shadow rounded-lg p-4 relative"
            >
              {graphResult?.length ? (
                <BarChartComponent
                  title={`Graph ${graphNumber}`}
                  data={graphResult}
                />
              ) : (
                <p className="text-gray-400 text-center mt-10">
                  No data available for Graph {graphNumber}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
