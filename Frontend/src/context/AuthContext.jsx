import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("❌ Error parsing stored user");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

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

      if (res.status === 401) {
        // Token expired, attempt to refresh
        const refreshed = await refreshToken();
        if (refreshed) {
          return fetchUserDetails(); // Retry after refresh
        } else {
          // If refresh fails, handle it here
          handleTokenExpired();
          return;
        }
      }

      if (!res.ok) throw new Error("Failed to fetch user details");

      const data = await res.json();
      if (!data || !data.user) throw new Error("Invalid user data");

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("❌ Fetch user error:", error.message);
      handleTokenExpired();
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!refreshToken || !storedUser?.emailID) return false;

    try {
      const res = await fetch("https://dwareautomator.mresult.com/api/refresh/refreshToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailID: storedUser.emailID,
          refreshToken: refreshToken,
        }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (!data || !data.accessToken) return false;

      localStorage.setItem("token", data.accessToken);
      return true;
    } catch (err) {
      console.error("❌ Token refresh error:", err.message);
      return false;
    }
  };

  const handleTokenExpired = () => {
    alert("⚠️ Your session has expired. You will be redirected to login.");
    logout();
    window.location.reload(); // refresh the page completely
  };

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
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/dashboard");

      await fetchUserDetails();
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    if (navigate) navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
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
