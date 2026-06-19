import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";

const Login = () => {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

// Redirect already logged-in users
useEffect(() => {
const user = localStorage.getItem("user");

if (user) {
  navigate("/dashboard");
}
}, [navigate]);

const handleLogin = async (e) => {
e.preventDefault();
setError("");
setLoading(true);

try {
  const res = await loginUser({
    email,
    password,
  });

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

return ( <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white"> <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg">


    <h1 className="text-3xl font-bold mb-6 text-center">
      Login
    </h1>

    {error && (
      <div className="bg-red-600 p-3 rounded mb-4">
        {error}
      </div>
    )}

    <form
      onSubmit={handleLogin}
      className="space-y-4"
    >
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
      <Link
        to="/register"
        className="text-blue-400 hover:underline"
      >
        Register
      </Link>
    </p>

  </div>
</div>
);
};

export default Login;
