import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

const ResetPasswordPage = () => {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const res = await API.post("/auth/reset-password", {
        password,
        token: id,
      });

      console.log(res.data);
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Error resetting password");
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>

      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
};

export default ResetPasswordPage;
