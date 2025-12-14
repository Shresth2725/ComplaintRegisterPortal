import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

const ResetPasswordPage = () => {
  const { id } = useParams(); // This is the token
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/auth/reset-password", {
        password,
        token: id,
      });

      if (res.data.success) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Fallback if success flag isn't present but no error thrown
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Error resetting password. Link may be expired."
      );
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans transition-colors">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 inline-block"
          >
            ComplaintPortal
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Set New Password
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Enter your new password below
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                {error}
              </p>
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg">
              <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                {message}
              </p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Reseting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <p className="mt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
            <Link
              to="/login"
              className="text-blue-700 hover:text-blue-800 font-semibold hover:underline"
            >
              Back to Login
            </Link>
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

export default ResetPasswordPage;
