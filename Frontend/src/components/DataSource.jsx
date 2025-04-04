import { useEffect, useState } from "react";

const DataSource = () => {
  const [dataSources, setDataSources] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized. Please log in.");

        const response = await fetch("https://dwareautomator.mresult.com/api/dataSource/getDS", {
          headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgiLCJFbWFpbCI6InJhZ3NhbmpheTdAb3V0bG9vay5jb20iLCJuYmYiOjE3NDM3NTkwNTAsImV4cCI6MTc0Mzc2MjY1MCwiaWF0IjoxNzQzNzU5MDUwLCJpc3MiOiJodHRwczovL2R3YXJlYXV0b21hdG9yLm1yZXN1bHQuY29tOjQyMDAifQ.mrWQUci24HgmnIVhAde9YPT9nFPixMEuVNHRiLBbrhI" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data sources");
        }

        const data = await response.json();
        setDataSources(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDataSources();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-xl font-bold">Data Sources</h1>
      <ul>
        {dataSources.map(({ id, name, type, icon, isTestActive }) => (
          <li key={id} className="border p-2 m-2">
            <img src={`/icons/${icon}`} alt={name} className="w-8 h-8 inline-block" />
            {name} ({type}) - {isTestActive ? "Test Active" : "Not Active"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataSource;
