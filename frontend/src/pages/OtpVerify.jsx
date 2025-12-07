import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-slate-900 tracking-tight mb-2 inline-block">
            ComplaintPortal
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Verify OTP</h1>
          <p className="text-slate-600">
            A verification code has been sent to{" "}
            <span className="text-slate-900 font-semibold">{email}</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
          {/* OTP Input */}
          <input
            type="number"
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900
                       placeholder-slate-400 text-center text-xl tracking-[15px]
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="••••••"
          />

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            className="w-full mt-6 py-3 bg-blue-700 hover:bg-blue-800 text-white 
                       font-semibold rounded-lg transition-colors shadow-sm"
          >
            Verify OTP
          </button>

          {/* Resend Link */}
          <p className="mt-6 text-slate-600 text-sm">
            Didn’t receive the OTP?{" "}
            <span className="text-blue-700 font-semibold cursor-pointer hover:text-blue-800 hover:underline">
              Resend Code
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
