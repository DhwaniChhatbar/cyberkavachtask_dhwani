import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
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

      alert(res.data.message);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        {error && (
          <div className="bg-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 outline-none"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 outline-none"
          >
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
            <option value="StudentCoordinator">Student Coordinator</option>
            <option value="TechCoordinator">Tech Coordinator</option>
            <option value="ContentCoordinator">Content Coordinator</option>
            <option value="SocialMediaCoordinator">
              Social Media Coordinator
            </option>
            <option value="FacultyCoordinator">Faculty Coordinator</option>
            <option value="Guest">Guest</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="text-center mt-5 text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;