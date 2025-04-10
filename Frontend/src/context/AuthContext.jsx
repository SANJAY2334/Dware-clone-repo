import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const devToken = localStorage.getItem("token");
    const devUser = localStorage.getItem("user");

    const clientToken = localStorage.getItem("clientToken");
    const clientUser = localStorage.getItem("clientUser");

    if (devToken && devUser) {
      try {
        setUser(JSON.parse(devUser));
      } catch (err) {
        console.error("❌ Dev user parse error");
        localStorage.removeItem("user");
      }
    } else if (clientToken && clientUser) {
      try {
        setUser(JSON.parse(clientUser));
      } catch (err) {
        console.error("❌ Client user parse error");
        localStorage.removeItem("clientUser");
      }
    }

    setLoading(false);
  }, []);

  // ✅ Fetch Developer User Details
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found!");

      const res = await fetch("http://localhost:5000/api/getUserDetails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!data || !data.user) throw new Error("Invalid user data");

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("❌ Fetch user error:", error.message);
      logout();
    }
  };

  // ✅ Developer Login
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
    }
  };

  // ✅ Client Login
  const clientLogin = async (email, password, navigate) => {
    try {
      const res = await fetch(
        "https://dwareautomator.mresult.com/api/users/authenticateUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ EmailID: email, Password: password }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.token) throw new Error("Client login failed");

      localStorage.setItem("clientToken", data.token);
      localStorage.setItem("clientUser", JSON.stringify(data.user[0]));
      setUser(data.user[0]);
      navigate("/dashboard");
    } catch (error) {
      alert("Client Login Failed: " + error.message);
    }
  };

  // ✅ Logout for both
  const logout = (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientUser");
    setUser(null);
    if (navigate) navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,         // Developer login
        clientLogin,   // Client login
        logout,
        loading,
        fetchUserDetails,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
