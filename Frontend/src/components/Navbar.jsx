import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaCaretDown } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import DwareLogo from "/icons/Dware-Logo.png";

const Navbar = ({ isSidebarOpen, toggleSidebar, onProjectChange }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const clientUser = JSON.parse(localStorage.getItem("clientUser"));
  const token = localStorage.getItem("token");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayName =
    user?.firstName ||
    clientUser?.firstName ||
    clientUser?.emailID ||
    user?.emailID ||
    "User";

  useEffect(() => {
    const savedProject = localStorage.getItem("selectedProject");
    if (savedProject) {
      setSelectedProject(JSON.parse(savedProject));
    } else {
      setSelectedProject({ projectID: 2, projectName: "Demo" });
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://dwareautomator.mresult.com/api/Admin/ProjectsList",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        const activeProjects = data.filter((proj) => proj.status);
        setProjects(activeProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [token]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleProjectDropdown = () =>
    setIsProjectDropdownOpen(!isProjectDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout(navigate);
    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  const handleProjectChange = async (projectID, projectName) => {
    const selectedProject = { projectID, projectName };
    localStorage.setItem("selectedProject", JSON.stringify(selectedProject));
    setSelectedProject(selectedProject);

    try {
      const response = await fetch(
        "https://dwareautomator.mresult.com/api/Users/ChangeProjectHeader",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectID),
        }
      );

      if (!response.ok) throw new Error("Failed to switch project");

      onProjectChange?.(projectID);
      setIsProjectDropdownOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error switching project:", error);
    }
  };

  return (
    <div className="bg-gray-900 p-5 flex justify-between items-center shadow-md transition-all duration-300">
      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="text-white text-2xl hover:bg-gray-700 p-2 rounded-full"
      >
        <FaBars />
      </button>

     {/* Logo (Clickable) */}
<div
  className={`items-center ${
    isSidebarOpen ? "mr-170" : "mr-240"
  } gap-2 cursor-pointer transition-all duration-300`}
  onClick={() => navigate("/dashboard")}
  title="Go to Dashboard"
>
  <img
    src={DwareLogo}
    alt="Dware Logo"
    className="h-12 w-auto transition-transform duration-300 "
  />
</div>


      {/* Right Side - Desktop */}
      <div className="relative flex items-center gap-4 mr-4">
        {/* Project Dropdown */}
        <div className="relative">
          <button
            onClick={toggleProjectDropdown}
            className="flex items-center bg-gray-800 border border-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-gray-700 transition-all duration-200"
          >
            {selectedProject ? selectedProject.projectName : "Select Project"}
            <FaCaretDown className="ml-2 text-gray-400" />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
              <div className="max-h-60 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.projectID}
                    onClick={() =>
                      handleProjectChange(
                        project.projectID,
                        project.project_Name
                      )
                    }
                    className={`w-full text-left px-4 py-2 text-sm ${
                      selectedProject?.projectID === project.projectID
                        ? "bg-gray-700 text-blue-400 font-semibold"
                        : "text-gray-300 hover:bg-gray-700"
                    } transition-all duration-150`}
                  >
                    {project.project_Name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Welcome Text */}
        <span className="text-white text-xl font-medium">
          Welcome, {displayName}
        </span>

        {/* Profile Dropdown */}
        <button
          onClick={toggleDropdown}
          className="flex items-center text-white text-xl hover:bg-gray-700 p-2 rounded-xl"
        >
          <FaCaretDown className="ml-2" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-30 w-30 bg-gray-800 rounded-lg shadow-xl z-10">
            <div className="py-2">
              <button
                onClick={handleProfile}
                className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 rounded-md"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-gray-900 p-4 md:hidden z-20">
          <div className="flex flex-col gap-2">
            {projects.map((project) => (
              <button
                key={project.projectID}
                onClick={() =>
                  handleProjectChange(project.projectID, project.project_Name)
                }
                className="w-full text-left text-gray-200 hover:bg-gray-700 rounded-md"
              >
                {project.project_Name}
              </button>
            ))}
            <button
              onClick={handleProfile}
              className="w-full text-left text-gray-200 hover:bg-gray-700 rounded-md"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-400 hover:bg-gray-700 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
