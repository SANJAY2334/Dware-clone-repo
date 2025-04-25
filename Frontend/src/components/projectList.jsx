import React, { useState, useEffect } from "react";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure the token is stored
        const response = await fetch("https://dwareautomator.mresult.com/api/Admin/ProjectsList", {
          headers: {
            "Authorization": `Bearer ${token}`, 
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
