import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [otp, setOtp] = useState();

  const sendPasswordResetOtp = async () => {
    const res = await API.post("/auth/sendPasswordResetOtp", { email });
    if (res.data.success) setIsOtpSend(true);
  };

  const verifyPasswordResetOtp = async () => {
    const res = await API.post("/auth/verifyPasswordResetOtp", { email, otp });
    // console.log(res);

    const { resetToken } = res.data;
    // console.log(userId);

    navigate(`/reset-password/${resetToken}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="entet email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendPasswordResetOtp}>Send Otp</button>

      {isOtpSend && (
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyPasswordResetOtp}>Verify Otp</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
