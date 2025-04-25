import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const clientToken = localStorage.getItem("clientToken");

  const isAuthenticated = user || token || clientToken;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
