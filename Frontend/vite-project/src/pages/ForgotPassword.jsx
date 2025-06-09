        import React, { useState } from "react";
        import axios from "axios";
        import { useNavigate } from "react-router-dom";

        const ForgotPassword = () => {
          const navigate = useNavigate();
          const [email, setEmail] = useState("");
          const [newPassword, setNewPassword] = useState("");
          const [confirmPassword, setConfirmPassword] = useState("");
          const [error, setError] = useState("");
          const [msg, setMsg] = useState("");

          // Handle password reset
          const handleResetPassword = async () => {
            setError("");
            if (newPassword !== confirmPassword) {
              setError("Passwords do not match.");
              return;
            }
            try {
            await axios.put("http://localhost:2806/user/forgot-password", {
          email,
          newPassword,
        });
              setMsg(res.data.message);
              setTimeout(() => navigate("/login"), 2000);
            } catch (err) {
              setError(err.response?.data?.message || "Failed to reset password");
            }
          };

          return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
              <div className="w-full sm:w-[400px] bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-200 text-red-800 p-2 rounded-md mb-4 text-center">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {msg && (
                  <div className="bg-green-200 text-green-800 p-2 rounded-md mb-4 text-center">
                    {msg}
                  </div>
                )}

                <label className="block mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mb-4"
                />

                <label className="block mb-2 text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mb-4"
                />

                <label className="block mb-2 text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mb-6"
                />

                <button
                  onClick={handleResetPassword}
                  className="w-full p-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200"
                >
                  Reset Password
                </button>
              </div>
            </div>

          );
        };


        
        export default ForgotPassword;
