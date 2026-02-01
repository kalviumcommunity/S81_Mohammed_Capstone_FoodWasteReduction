                import React, { useState } from "react";
                import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
                import axios from "axios";
                import { useNavigate } from "react-router-dom";
                import { API_ENDPOINTS } from "../config/api";

                function Signup(props) {
                  const [hide, setHide] = useState(true);
                  const [hided, setHided] = useState(true);
                  const [err, setErr] = useState("");
                  const [data, setData] = useState({
                    name: "",
                    email: "",
                    password: "",
                    confirmpass: "",
                  });

                  const navigate = useNavigate();

                  const handleHide = () => setHide(!hide);
                  const handleHided = () => setHided(!hided);

                  const handleForm = (e) => {
                    setData({ ...data, [e.target.name]: e.target.value });
                  };

                  const handleSubmit = async () => {
                    const { name, email, password, confirmpass } = data;
                    if (password !== confirmpass) {
                      setErr("Passwords do not match");
                      return;
                    }




                    if (!name || !email || !password || !confirmpass) {
                      setErr("Please fill all fields");
                      return;
                    }

                    // ytfctugvbiuhbguvtcfrcxurgvbjhnxzerxdgfchvjb

                    try {
                      const response = await axios.post(API_ENDPOINTS.SIGNUP, {
                        name,
                        email,
                        password,
                      });

                      console.log("Successfully registered:", response.data);
                      
                      // Navigate to login page after successful signup
                      navigate("/login");
                    } catch (error) {
                      console.error("Signup error:", error);
                      setErr(error.response?.data?.message || "Signup failed. Please try again.");
                    }
                  };

                  return (
                    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                      <div className="w-full max-w-md">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 fade-in">
                          {/* Header */}
                          <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                              Create Account
                            </h1>
                            <p className="text-gray-600 text-sm">Join PantryChef to get started</p>
                          </div>

                          {err && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 fade-in">
                              <p className="text-sm font-medium">{err}</p>
                            </div>
                          )}

                          <form className="space-y-5">
                            <div>
                              <label htmlFor="name" className="block text-gray-700 font-medium mb-2 text-sm">
                                Full Name
                              </label>
                              <input
                                id="name"
                                name="name"
                                type="text"
                                value={data.name}
                                onChange={handleForm}
                                placeholder="Enter your full name"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                              />
                            </div>

                            <div>
                              <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-sm">
                                Email Address
                              </label>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={handleForm}
                                placeholder="Enter your email"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                              />
                            </div>

                            <div>
                              <label htmlFor="password" className="block text-gray-700 font-medium mb-2 text-sm">
                                Password
                              </label>
                              <div className="relative">
                                <input
                                  id="password"
                                  name="password"
                                  type={hide ? "password" : "text"}
                                  value={data.password}
                                  onChange={handleForm}
                                  placeholder="Create a strong password"
                                  className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                                />
                                <button
                                  type="button"
                                  onClick={handleHide}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  {hide ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="confirmpass" className="block text-gray-700 font-medium mb-2 text-sm">
                                Confirm Password
                              </label>
                              <div className="relative">
                                <input
                                  id="confirmpass"
                                  name="confirmpass"
                                  type={hided ? "password" : "text"}
                                  value={data.confirmpass}
                                  onChange={handleForm}
                                  placeholder="Confirm your password"
                                  className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                                />
                                <button
                                  type="button"
                                  onClick={handleHided}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  {hided ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center text-sm">
                              <input 
                                type="checkbox" 
                                id="remember" 
                                className="w-4 h-4 border-gray-300 rounded focus:ring-gray-900"
                              />
                              <label htmlFor="remember" className="ml-2 text-gray-600">
                                I agree to the Terms & Conditions
                              </label>
                            </div>

                            <button
                              type="button"
                              onClick={handleSubmit}
                              className="w-full bg-gray-900 text-white font-medium py-3 rounded hover:bg-gray-800 transition-colors"
                            >
                              Create Account
                            </button>
                          </form>

                          <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                              Already have an account?{" "}
                              <span
                                onClick={() => navigate("/login")}
                                className="text-gray-900 font-semibold cursor-pointer hover:underline"
                              >
                                Sign in
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                export default Signup;


                