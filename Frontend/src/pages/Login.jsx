import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import authBg from "../assets/auth.bg.jpg"; // Ensure the path is correct

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);

  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) errors.length = "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(password)) errors.uppercase = "Include at least one uppercase letter.";
    if (!/[0-9]/.test(password)) errors.number = "Include at least one number.";
    
    setErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      login(email, password, navigate);
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
          {/* Email Input */}
          <div className="relative mb-4">
            <input
              type="email"
              placeholder="Email"
              className={`border border-gray-600 bg-transparent text-white p-3 w-full rounded-lg transition-all duration-300 outline-none 
                ${focused === "email" ? "border-blue-500 shadow-blue-500 shadow-sm" : ""}`}
              value={email}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative mb-4">
            <input
              type="password"
              placeholder="Password"
              className={`border border-gray-600 bg-transparent text-white p-3 w-full rounded-lg transition-all duration-300 outline-none 
                ${focused === "password" ? "border-blue-500 shadow-blue-500 shadow-sm" : ""}`}
              value={password}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
            />
          </div>

          {/* Password Validation */}
          <div className="text-sm text-gray-400 mb-4">
            <p className={password.length >= 6 ? "text-green-400" : "text-red-500"}>
              {password.length >= 8 ? "✔" : "✖"} At least 8 characters
            </p>
            <p className={/[A-Z]/.test(password) ? "text-green-400" : "text-red-500"}>
              {/[A-Z]/.test(password) ? "✔" : "✖"} One uppercase letter
            </p>
            <p className={/[0-9]/.test(password) ? "text-green-400" : "text-red-500"}>
              {/[0-9]/.test(password) ? "✔" : "✖"} One number
            </p>
            
          </div>

          {/* Login Button */}
          <button className="bg-blue-600 text-white p-3 w-full rounded-lg hover:bg-blue-500 transition-all duration-300 shadow-sm hover:shadow-blue-500">
            Login
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline transition-all duration-300">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
