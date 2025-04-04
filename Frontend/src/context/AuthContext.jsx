import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from local storage on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // ✅ Only parse if valid
      } catch (error) {
        console.error("❌ Error parsing user data:", error.message);
        localStorage.removeItem("user"); // ✅ Remove invalid data
      }
    }

    setLoading(false);
  }, []);

  // ✅ Fetch User Details Function
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found!");

      const res = await fetch("http://localhost:5000/api/getUserDetails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token} `,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user details");

      const data = await res.json();
      if (!data || !data.user) throw new Error("Invalid user data received");

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("✅ Fetched User Details:", data.user);
    } catch (error) {
      console.error("❌ Error fetching user details:", error.message);
      logout();
    }
  };

  // ✅ Login Function
  const login = async (email, password, navigate) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/dashboard");

      await fetchUserDetails();
    } catch (error) {
      alert(error.message);
      console.error("❌ Login Error:", error.message);
    }
  };

  // ✅ Logout Function
  const logout = (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    if (navigate) navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fetchUserDetails }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;