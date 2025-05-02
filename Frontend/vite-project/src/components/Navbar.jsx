import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-green-500 to-teal-500 py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          PantryChef
        </h1>
        
        {/* Navigation Links */}
        <div className="space-x-8 flex items-center">
          <Link
            to="/"
            className="text-white font-medium hover:text-green-200 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/add-grocery"
            className="text-white font-medium hover:text-green-200 transition duration-200"
          >
            Add Grocery
          </Link>
          <Link
            to="/profile"
            className="text-white font-medium hover:text-green-200 transition duration-200"
          >
            Profile
          </Link>
          <Link
  to="/login"
  className="bg-white text-green-700 border border-green-700 font-semibold px-6 py-2 rounded-md hover:bg-green-700 hover:text-white transition duration-200"
>
  Login
</Link>

          
          {/* Signup Button - More Prominent */}
          <Link
  to="/signup"
  className="bg-white text-green-700 border border-green-700 font-semibold px-6 py-2 rounded-md hover:bg-green-700 hover:text-white transition duration-200"
>
  Signup
</Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
