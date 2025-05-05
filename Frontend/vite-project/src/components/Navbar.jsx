import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-green-600 py-4 px-6 shadow-lg">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    {/* Logo + Brand Name Section */}
    <Link to="/" className="flex items-center space-x-2">
      <img
        src="https://sdmntpreastus2.oaiusercontent.com/files/00000000-8064-61f6-8e5f-58744f064ce5/raw?se=2025-05-05T05%3A22%3A43Z&sp=r&sv=2024-08-04&sr=b&scid=2d3fbc0c-bdb2-56af-836e-f2d676d0b802&skoid=3f3a9132-9530-48ef-96b7-fee5a811733f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-05T01%3A30%3A45Z&ske=2025-05-06T01%3A30%3A45Z&sks=b&skv=2024-08-04&sig=FDA4aCPLkT4fMwAmm1yp/y4T06hMaIJ77mP2tGfWsJY%3D"
        alt="PantryChef Logo"
        className="w-10 h-10 rounded-full shadow-md"
      />
      <h1 className="text-2xl font-extrabold text-white tracking-wide">
        pantryChef
      </h1>
    </Link>

    {/* Navigation Links */}
    <div className="space-x-10 flex items-center">
      <Link to="/" className="text-white font-medium hover:text-gray-200 transition duration-200">
        Home
      </Link>
      <Link to="/add-grocery" className="text-white font-medium hover:text-gray-200 transition duration-200">
        Add Grocery
      </Link>
      <Link to="/profile" className="text-white font-medium hover:text-gray-200 transition duration-200">
        Profile
      </Link>
      <Link
        to="/login"
        className="bg-white text-black-700 border border-green-700 font-semibold px-6 py-2 rounded-md hover:bg-gray-700 hover:text-white transition duration-200"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="bg-white text-black-700 border border-green-700 font-semibold px-6 py-2 rounded-md hover:bg-gray-700 hover:text-white transition duration-200"
      >
        Signup
      </Link>
    </div>
  </div>
</nav>
  );
}

export default Navbar;
