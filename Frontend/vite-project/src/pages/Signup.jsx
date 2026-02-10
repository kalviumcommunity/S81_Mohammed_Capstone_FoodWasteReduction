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
                    <div className="flex justify-center items-center min-h-screen bg-white p-4">
                      <div className="w-full max-w-md">
                        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8 fade-in">
                          {/* Header */}
                          <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                              <span className="text-xl">✨</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                              Get Started
                            </h1>
                            <p className="text-gray-600 text-sm">Join PantryChef today</p>
                          </div>

                          {err && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 fade-in">
                              <p className="text-sm font-medium">{err}</p>
                            </div>
                          )}

                          <form className="space-y-4">
                            <div>
                              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2 text-sm">
                                Full Name
                              </label>
                              <input
                                id="name"
                                name="name"
                                type="text"
                                value={data.name}
                                onChange={handleForm}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all bg-blue-50"
                              />
                            </div>

                            <div>
                              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm">
                                Email Address
                              </label>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={handleForm}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all bg-blue-50"
                              />
                            </div>

                            <div>
                              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2 text-sm">
                                Password
                              </label>
                              <div className="relative">
                                <input
                                  id="password"
                                  name="password"
                                  type={hide ? "password" : "text"}
                                  value={data.password}
                                  onChange={handleForm}
                                  placeholder="••••••••"
                                  className="w-full px-4 py-3 pr-12 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all bg-blue-50"
                                />
                                <button
                                  type="button"
                                  onClick={handleHide}
                                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                  {hide ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="confirmpass" className="block text-gray-700 font-semibold mb-2 text-sm">
                                Confirm Password
                              </label>
                              <div className="relative">
                                <input
                                  id="confirmpass"
                                  name="confirmpass"
                                  type={hided ? "password" : "text"}
                                  value={data.confirmpass}
                                  onChange={handleForm}
                                  placeholder="••••••••"
                                  className="w-full px-4 py-3 pr-12 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all bg-blue-50"
                                />
                                <button
                                  type="button"
                                  onClick={handleHided}
                                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                  {hided ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center text-sm mt-6">
                              <input 
                                type="checkbox" 
                                id="remember" 
                                className="w-4 h-4 border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                              <label htmlFor="remember" className="ml-2 text-gray-600 hover:text-blue-600">
                                I agree to Terms & Conditions
                              </label>
                            </div>

                            <button
                              type="button"
                              onClick={handleSubmit}
                              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 mt-6"
                            >
                              Create Account
                            </button>
                          </form>

                          <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-blue-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-2 bg-white text-gray-500">or</span>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-gray-600 text-sm">
                              Already have an account?{" "}
                              <span
                                onClick={() => navigate("/login")}
                                className="text-blue-600 font-bold cursor-pointer hover:underline transition-colors"
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


                