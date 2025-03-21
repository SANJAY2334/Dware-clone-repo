import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-teal-100 p-3  flex justify-between items-center shadow-md">
      {/* Brand Name */}
      <h1 className="text-gray-900 font-bold text-2xl ml-4">DWARE</h1>

      {/* User Info & Logout */}
      <div className="flex items-center gap-4 mr-4">
        {/* Display User Name */}
        {user && (
          <span className="text-gray-900 font-medium">
            Welcome, {user.name || "User"} 
          </span>
        )}

        {/* Logout Button */}
        
        <div></div>
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
