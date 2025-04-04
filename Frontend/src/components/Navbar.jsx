import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaAndroid, FaBars, FaTimes } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import QwareLogo from "../assets/Dware.png"; // Import your logo here

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-blue-200 p-5 flex justify-between items-center shadow-md transition-all duration-300">
      
      {/* Sidebar Toggle Button */}
      <button onClick={toggleSidebar} className="ml-4 text-gray-900 text-2xl hover:bg-gray-100 p-2 rounded-full transition-all duration-200">
        {isSidebarOpen ? <FaBars /> : <FaBars />}
      </button>

      {/* Brand Name */}
      <div className="flex items-center gap-2">
        <img src={QwareLogo} alt="Qware Logo" className="h-8 w-auto" />
        <h1 className="text-gray-900 font-bold text-2xl">QWARE</h1>
        <h1 className="text-gray-900 text-2xl">Automator</h1>
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center gap-4 mr-4">
        {/* Display User Name */}
        {user && <span className="text-gray-900 text-xl font-medium">Welcome, {user.name || "User"}</span>}

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
