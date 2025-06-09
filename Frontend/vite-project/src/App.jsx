    // App.jsx
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import Login from './pages/Login';
    import Signup from './pages/Signup';
    import Home from './pages/Home';
    import Profile from './pages/Profile';
    import AddGrocery from './pages/AddGrocery';
    import Navbar from './components/Navbar';
    import ForgotPassword from './pages/ForgotPassword';

    function App() {
      return (
        
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-grocery" element={<AddGrocery />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
          </Routes>
        </Router>
      );
    }

    export default App;
