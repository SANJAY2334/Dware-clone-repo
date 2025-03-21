import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import AuthContext from "../context/AuthContext";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-blue-200 p-5 flex justify-between items-center shadow-md transition-all duration-300">
      
      {/* Sidebar Toggle Button */}
      <button onClick={toggleSidebar} className="ml-4 text-gray-900 text-2xl">
        {isSidebarOpen ? <FaBars /> : <FaBars />}
      </button>

      {/* Brand Name */}
      <h1 className="text-gray-900 font-bold text-2xl">DWARE</h1>

      {/* User Info & Logout */}
      <div className="flex items-center gap-4 mr-4">
        {/* Display User Name */}
        {user && <span className="text-gray-900 font-medium">Welcome, {user.name || "User"}</span>}

        {/* Logout Button */}
        <button
          onClick={() => logout(navigate)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
