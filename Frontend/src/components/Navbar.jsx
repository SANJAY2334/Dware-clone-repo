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
  const [selectedProject, setSelectedProject] = useState(null); // Store the selected project
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle

  // Get user display name
  const displayName =
    user?.firstName ||
    clientUser?.firstName ||
    clientUser?.emailID ||
    user?.emailID ||
    "User";

  // Fetch project list on load and selected project from localStorage
  useEffect(() => {
    // Fetch saved selected project from localStorage
    const savedProject = localStorage.getItem("selectedProject");
    if (savedProject) {
      setSelectedProject(JSON.parse(savedProject));
    } else {
      // Default to Demo if no project is saved
      setSelectedProject({ projectID: 2, projectName: "Demo" });
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch("https://dwareautomator.mresult.com/api/Admin/ProjectsList", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        const activeProjects = data.filter((proj) => proj.status);
        setProjects(activeProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [token]); // Only trigger when token changes

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleProjectDropdown = () => setIsProjectDropdownOpen(!isProjectDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle for mobile menu

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
    
    // Save the selected project in localStorage
    localStorage.setItem("selectedProject", JSON.stringify(selectedProject));
    
    // Update state to reflect the selected project
    setSelectedProject(selectedProject);
    
    try {
      const response = await fetch("https://dwareautomator.mresult.com/api/Users/ChangeProjectHeader", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectID),
      });

      if (!response.ok) throw new Error("Failed to switch project");

      onProjectChange?.(projectID); // Notify parent of project change
      setIsProjectDropdownOpen(false);

      // Trigger a page reload
      window.location.reload();
    } catch (error) {
      console.error("Error switching project:", error);
    }
  };

  return (
    <div className="bg-blue-300 p-5 flex justify-between items-center shadow-md transition-all duration-300">
      {/* Hamburger Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="text-gray-900 text-2xl hover:bg-gray-100 p-2 rounded-full"
      >
        <FaBars />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={DwareLogo} alt="Dware Logo" className="h-12 w-auto" />
      </div>

      {/* Desktop Navigation */}
      <div className="relative flex items-center gap-4 mr-4 md:flex">
        {/* Project Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="flex items-center bg-white border border-gray-300 text-gray-900 text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200"
          >
            {selectedProject ? selectedProject.projectName : "Select Project"}
            <FaCaretDown className="ml-2 text-gray-500" />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="max-h-60 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.projectID}
                    onClick={() => handleProjectChange(project.projectID, project.project_Name)}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      selectedProject?.projectID === project.projectID
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-900 hover:bg-gray-100"
                    } transition-all duration-150`}
                  >
                    {project.project_Name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Welcome Message */}
        <span className="text-gray-900 text-xl font-medium">Welcome, {displayName}</span>

        {/* User Options Dropdown */}
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-900 text-xl hover:bg-gray-100 p-2 rounded-xl"
        >
          <FaCaretDown className="ml-2" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-30 w-30 bg-white rounded-lg shadow-xl z-10">
            <div className="py-2">
              <button
                onClick={handleProfile}
                className="w-full text-left px-4 py-2 text-gray-900 hover:bg-blue-100 rounded-md"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-blue-100 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-blue-300 p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {projects.map((project) => (
              <button
                key={project.projectID}
                onClick={() => handleProjectChange(project.projectID, project.project_Name)}
                className="w-full text-left text-gray-900 hover:bg-blue-100 rounded-md"
              >
                {project.project_Name}
              </button>
            ))}
            <button
              onClick={handleProfile}
              className="w-full text-left text-gray-900 hover:bg-blue-100 rounded-md"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-500 hover:bg-blue-100 rounded-md"
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
