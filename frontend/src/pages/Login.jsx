import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Normal Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userData", JSON.stringify(res.data.user));

        navigate(res.data.user.isAdmin ? "/admin-dashboard" : "/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleSuccess = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);

      const res = await API.post("/auth/google-login", {
        email: decoded.email,
        fullName: decoded.name,
        profilePic: decoded.picture,
        googleId: decoded.sub,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));

      navigate(res.data.user.isAdmin ? "/admin-dashboard" : "/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans transition-colors">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 inline-block">
            ComplaintPortal
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome Back</h1>
          <p className="text-slate-600 dark:text-slate-400">Login to your account to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Google Login */}
          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or continue with</span>
              </div>
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login failed")}
              />
            </div>
          </div>

          {/* Signup Link */}
          <p className="mt-6 text-center text-slate-600 dark:text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-700 hover:text-blue-800 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>

          {/* Forgot Password */}
          <p className="mt-3 text-center text-sm">
            <button
              type="button"
              className="text-blue-700 hover:text-blue-800 font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 dark:text-slate-500 text-xs mt-8">
          © 2025 Complaint Register Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
