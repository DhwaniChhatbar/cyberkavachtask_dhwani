import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Guest",

    collegeId: "",
    department: "",
    institute: "",
    year: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await registerUser(formData);

      alert(
        res.data.message ||
          "Registration successful. Please login."
      );

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 text-white">

      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-4">
          Register to access CyberKavach platform
        </p>

        {/* 🔥 SAME TECH QUOTE AS LOGIN */}
        <div className="mb-5 p-4 rounded bg-gray-800 text-center border border-gray-700">
          <p className="text-sm italic text-gray-300">
            “Any sufficiently advanced technology is indistinguishable from magic.”
          </p>
          <p className="text-xs text-gray-500 mt-2">
            — Arthur C. Clarke
          </p>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
            required
          />

          <input
            type="text"
            name="collegeId"
            placeholder="College ID"
            value={formData.collegeId}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
            required
          />

          <input
            type="text"
            name="year"
            placeholder="Year (1st / 2nd / 3rd / 4th)"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department (optional)"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
          />

          <input
            type="text"
            name="institute"
            placeholder="Institute (optional)"
            value={formData.institute}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-lg outline-none"
          >
            <option value="Guest">Guest</option>
            <option value="Member">Club Member</option>
            <option value="Student Coordinator">Student Coordinator</option>
            <option value="Tech Coordinator">Tech Coordinator</option>
            <option value="Content Coordinator">Content Coordinator</option>
            <option value="Social Media Coordinator">Social Media Coordinator</option>
            <option value="Faculty Coordinator">Faculty Coordinator</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <div className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;