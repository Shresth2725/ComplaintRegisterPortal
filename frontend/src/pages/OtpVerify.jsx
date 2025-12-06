import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  const handleVerify = async () => {
    try {
      const res = await API.post("/auth/verify-otp", { email, otp });

      if (res.data.success) {
        const pending = JSON.parse(localStorage.getItem("pendingSignup"));

        if (!pending) {
          alert("Signup expired. Please register again.");
          return navigate("/signup");
        }

        const account = await API.post("/auth/create-account", pending);

        localStorage.setItem("token", account.data.token);
        localStorage.setItem("userData", JSON.stringify(account.data.user));
        localStorage.removeItem("pendingSignup");

        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Verify OTP</h1>
          <p className="text-gray-400">
            A verification code has been sent to{" "}
            <span className="text-white font-semibold">{email}</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
          {/* OTP Input */}
          <input
            type="number"
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white
                       placeholder-gray-400 text-center text-xl tracking-[15px]
                       focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            placeholder="••••••"
          />

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-700 text-white 
                       font-semibold rounded-lg transition shadow-lg"
          >
            Verify OTP
          </button>

          {/* Resend Link */}
          <p className="mt-6 text-gray-400 text-sm">
            Didn’t receive the OTP?{" "}
            <span className="text-purple-400 font-semibold cursor-pointer hover:text-purple-300">
              Resend Code
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
