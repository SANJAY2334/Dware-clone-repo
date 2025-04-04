import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authBg from "../assets/auth.bg.jpg"; // Ensure the path is correct

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    length: false,
    uppercase: false,
    number: false,
  });

  const validatePassword = (password) => {
    setErrors({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    });
  };

  const isValid = Object.values(errors).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }), // ✅ Sending firstName & lastName
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup successful! Please login.");
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      {/* Glassmorphic Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-black/40 backdrop-blur-md shadow-xl rounded-2xl w-96 border border-gray-800 text-white"
      >
        <h2 className="text-3xl font-bold mb-5 text-center text-gray-300">Create an Account</h2>

        {/* First Name Input */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="First Name"
            className="border border-gray-600 bg-transparent text-white p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        {/* Last Name Input */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Last Name"
            className="border border-gray-600 bg-transparent text-white p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        {/* Email Input */}
        <div className="relative mb-3">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-600 bg-transparent text-white p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-3">
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-600 bg-transparent text-white p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            required
          />
        </div>

        {/* Password Validation Messages */}
        <div className="text-sm text-gray-400 mb-4">
          <p className={errors.length ? "text-green-400" : "text-red-400"}>
            {errors.length ? "✔" : "✖"} At least 6 characters
          </p>
          <p className={errors.uppercase ? "text-green-400" : "text-red-400"}>
            {errors.uppercase ? "✔" : "✖"} At least one uppercase letter
          </p>
          <p className={errors.number ? "text-green-400" : "text-red-400"}>
            {errors.number ? "✔" : "✖"} At least one number
          </p>
        </div>

        {/* Signup Button */}
        <button
          className={`p-3 w-full rounded-lg font-semibold transition-all ${
            isValid
              ? "bg-blue-600 text-white hover:bg-blue-500 shadow-sm hover:shadow-blue-500"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!isValid}
        >
          Sign Up
        </button>

        {/* Already Have an Account? */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline transition-all duration-300">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
