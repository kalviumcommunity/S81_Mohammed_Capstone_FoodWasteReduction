// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2806';

// Common API endpoints
export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/user/login`,
  SIGNUP: `${API_BASE_URL}/user/signup`,
  LOGOUT: `${API_BASE_URL}/user/logout`,
  FORGOT_PASSWORD: `${API_BASE_URL}/user/forgot-password`,
  CHECK_LOGIN: `${API_BASE_URL}/user/checklogin`,
  UPLOAD_PHOTO: `${API_BASE_URL}/user/upload`,
  ADD_ADDRESS: `${API_BASE_URL}/user/add-address`,
  DELETE_ADDRESS: (id) => `${API_BASE_URL}/user/delete-address/${id}`,
  PROFILE_PHOTO: (filename) => `${API_BASE_URL}/profile-photo/${filename}`,
  GET_GROCERIES: (userId) => `${API_BASE_URL}/grocery/user/${userId}`,
  EXPIRING_GROCERIES: (userId, days = 3) => `${API_BASE_URL}/grocery/expiring/${userId}?days=${days}`,
  GROCERY: `${API_BASE_URL}/grocery`,
  // Notification endpoints
  NOTIFICATIONS: (userId) => `${API_BASE_URL}/notification/user/${userId}`,
  UNREAD_COUNT: (userId) => `${API_BASE_URL}/notification/unread/${userId}`,
  MARK_READ: (notificationId) => `${API_BASE_URL}/notification/read/${notificationId}`,
  MARK_ALL_READ: (userId) => `${API_BASE_URL}/notification/read-all/${userId}`,
  DELETE_NOTIFICATION: (notificationId) => `${API_BASE_URL}/notification/delete/${notificationId}`,
};
