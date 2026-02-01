              import React, { useState } from "react";
              import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
              import axios from "axios";
              import { useNavigate } from "react-router-dom";
              import Cookies from "js-cookie";
              import { API_ENDPOINTS } from "../config/api";

              function Login(props) {
                const navigate = useNavigate();

                const [hide, setHide] = useState(true);
                const [error, setError] = useState("");
                const [data, setData] = useState({
                  email: "",
                  password: "",
                });

                const handleHide = () => {
                  setHide(!hide);
                };

                const handleForm = (e) => {
                  setError("")
                  setData({ ...data, [e.target.name]: e.target.value });
                };

                const handleSubmit = async () => {
                  const { email, password } = data;
                  if (!email || !password) {
                    setError("Please fill all fields");
                    return;
                  }

                  try {
                    const response = await axios.post(API_ENDPOINTS.LOGIN, {
                      email,
                      password,
                    }, {
                      withCredentials: true   
                    });
                    
                    // Store token in cookie to ensure it's persisted
                    if (response.data.token) {
                      Cookies.set('accesstoken', response.data.token, {
                        expires: 30,
                        path: '/'
                      });
                    }
                    
                    console.log(response, "888");
                    navigate("/home");
                  } catch (error) {
                    console.log(error);
                    setError(error.response?.data?.message || "Login failed. Please try again.");
                  }
                };

                return (
                  <>
                    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                      <div className="w-full max-w-md">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 fade-in">
                          {/* Header */}
                          <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                              Sign In
                            </h1>
                            <p className="text-gray-600 text-sm">Welcome back to PantryChef</p>
                          </div>

                          {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 fade-in">
                              <p className="text-sm font-medium">{error}</p>
                            </div>
                          )}

                          <form className="space-y-5">
                            <div>
                              <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-sm">
                                Email Address
                              </label>
                              <input
                                id="email"
                                type="email"
                                name="email"
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
                                  placeholder="Enter your password"
                                  className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                                />
                                <button
                                  type="button"
                                  onClick={handleHide}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  {hide ? (
                                    <FaRegEye size={20} />
                                  ) : (
                                    <FaRegEyeSlash size={20} />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  id="remember" 
                                  className="w-4 h-4 border-gray-300 rounded focus:ring-gray-900"
                                />
                                <label htmlFor="remember" className="ml-2 text-gray-600">Remember me</label>
                              </div>
                              <span
                                onClick={() => navigate("/forgot-password")}
                                className="text-gray-700 hover:text-gray-900 font-medium cursor-pointer hover:underline"
                              >
                                Forgot password?
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={handleSubmit}
                              className="w-full bg-gray-900 text-white font-medium py-3 rounded hover:bg-gray-800 transition-colors"
                            >
                              Sign In
                            </button>
                          </form>

                          <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                              Don't have an account?{" "}
                              <span
                                onClick={() => navigate("/Signup")}
                                className="text-gray-900 font-semibold cursor-pointer hover:underline"
                              >
                                Sign up
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              }

              export default Login;
