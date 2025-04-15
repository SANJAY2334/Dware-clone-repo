import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import authBg from "../assets/auth.bg.jpg";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("developer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);

  const validatePassword = (pwd) => {
    const err = {};
    if (pwd.length < 8) err.length = "Min 8 characters";
    if (!/[A-Z]/.test(pwd)) err.uppercase = "One uppercase required";
    if (!/[0-9]/.test(pwd)) err.number = "One number required";
    setErrors(err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginType === "developer" && Object.keys(errors).length > 0) return;

    try {
      if (loginType === "developer") {
        login(email, password, () => {
          navigate("/dashboard"); // ✅ Always redirect to /dashboard
        });
      } else {
        const res = await axios.post(
          "https://dwareautomator.mresult.com/api/users/authenticateUser",
          { EmailID: email, Password: password }
        );

        const user = res.data.user[0];
        localStorage.setItem("clientToken", res.data.token);
        localStorage.setItem("clientUser", JSON.stringify(user));

        navigate("/dashboard"); // ✅ Always redirect to /dashboard
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="bg-black/40 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 border border-gray-700 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-300">Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Login As</label>
            <select
              value={loginType}
              onChange={(e) => setLoginType(e.target.value)}
              className="w-full border px-3 py-2 rounded bg-black/30 text-white"
            >
              <option value="developer">Developer</option>
              <option value="client">Client</option>
            </select>
          </div>

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

          <div className="relative mb-4">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              className={`border border-gray-600 bg-transparent text-white p-3 w-full rounded-lg outline-none transition 
                ${focused === "password" ? "border-blue-500 shadow-blue-500 shadow-sm" : ""}`}
              value={password}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              onChange={(e) => {
                setPassword(e.target.value);
                if (loginType === "developer") validatePassword(e.target.value);
              }}
              required
            />
          </div>

          {loginType === "developer" && (
            <div className="text-sm text-gray-400 mb-4">
              <p className={password.length >= 8 ? "text-green-400" : "text-red-500"}>
                {password.length >= 8 ? "✔" : "✖"} At least 8 characters
              </p>
              <p className={/[A-Z]/.test(password) ? "text-green-400" : "text-red-500"}>
                {/[A-Z]/.test(password) ? "✔" : "✖"} One uppercase letter
              </p>
              <p className={/[0-9]/.test(password) ? "text-green-400" : "text-red-500"}>
                {/[0-9]/.test(password) ? "✔" : "✖"} One number
              </p>
            </div>
          )}

          <button className="bg-blue-600 text-white p-3 w-full rounded-lg hover:bg-blue-500 transition">
            Login
          </button>

          {loginType === "developer" && (
            <p className="text-center text-sm text-gray-400 mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:underline">
                Sign up
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
