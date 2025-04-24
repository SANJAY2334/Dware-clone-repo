import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authBg from "../assets/auth.bg.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://dwareautomator.mresult.com/api/users/authenticateUser",
        { EmailID: email, Password: password }
      );

      const user = res.data.user[0];
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("clientUser", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="bg-black/40 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 border border-gray-700 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-300">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              className={`border border-gray-600 bg-transparent text-white p-3 w-full rounded-lg outline-none transition 
                ${focused === "email" ? "border-blue-500 shadow-blue-500 shadow-sm" : ""}`}
              value={email}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative mb-6">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              className={`border border-gray-600 bg-transparent text-white p-3 w-full rounded-lg outline-none transition 
                ${focused === "password" ? "border-blue-500 shadow-blue-500 shadow-sm" : ""}`}
              value={password}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="bg-blue-600 text-white p-3 w-full rounded-lg hover:bg-blue-500 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
