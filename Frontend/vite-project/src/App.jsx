    // App.jsx
    import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AddGrocery from './pages/AddGrocery';
import Navbar from './components/Navbar';
import ForgotPassword from './pages/ForgotPassword';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('accesstoken');
  return token ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to home if already logged in)
const PublicRoute = ({ children }) => {
  const token = Cookies.get('accesstoken');
  return !token ? children : <Navigate to="/home" replace />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default route - redirect to login if not authenticated, home if authenticated */}
        <Route path="/" element={
          Cookies.get('accesstoken') ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        } />
        
        {/* Public routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        
        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/add-grocery" element={<ProtectedRoute><AddGrocery /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
