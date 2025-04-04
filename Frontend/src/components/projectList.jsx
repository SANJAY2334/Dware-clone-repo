import React, { useState, useEffect } from "react";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure the token is stored
        const response = await fetch("https://dwareautomator.mresult.com/api/Admin/ProjectsList", {
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgiLCJFbWFpbCI6InJhZ3NhbmpheTdAb3V0bG9vay5jb20iLCJuYmYiOjE3NDM2ODA1MTMsImV4cCI6MTc0MzY4NDExMywiaWF0IjoxNzQzNjgwNTEzLCJpc3MiOiJodHRwczovL2R3YXJlYXV0b21hdG9yLm1yZXN1bHQuY29tOjQyMDAifQ.2UifD3DdZM8VrtDKUwHJQoQK8vIs9ibQNqzdrBeT4hc",
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h2>Project List</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.projectID}>
            {project.project_Name} - {project.status ? "Active" : "Inactive"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
