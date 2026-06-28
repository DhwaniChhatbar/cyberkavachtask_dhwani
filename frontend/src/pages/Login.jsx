import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      if (!res || !res.data) {
        throw new Error("Invalid server response");
      }

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Missing token or user data");
      }

      const safeUser = {
        ...user,
        role: user.role || "Member",
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(safeUser));

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">

      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            Welcome to CyberKavach
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Secure access to your dashboard, events, attendance and certificates
          </p>
        </div>

        {/* 🔥 TECH QUOTE SECTION ADDED */}
        <div className="mb-5 p-4 rounded bg-gray-800 text-center border border-gray-700">
          <p className="text-sm italic text-gray-300">
            “Any sufficiently advanced technology is indistinguishable from magic.”
          </p>
          <p className="text-xs text-gray-500 mt-2">
            — Arthur C. Clarke
          </p>
        </div>

        {error && (
          <div className="bg-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-800 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-800 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center mt-5 text-gray-400">
          New user?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;