
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';

// function Navbar() {
//   const token = Cookies.get('accesstoken');
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     Cookies.remove('accesstoken');
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-green py-4 px-6 shadow-lg">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         {/* Left: Logo + Brand Name */}
//         <Link to="/" className="flex items-center space-x-2">
//           {/* <img
//             // src="https://sdmntpreastus2.oaiusercontent.com/files/00000000-8064-61f6-8e5f-58744f064ce5/raw?se=2025-05-05T05%3A22%3A43Z&sp=r&sv=2024-08-04&sr=b&scid=2d3fbc0c-bdb2-56af-836e-f2d676d0b802&skoid=3f3a9132-9530-48ef-96b7-fee5a811733f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-05T01%3A30%3A45Z&ske=2025-05-06T01%3A30%3A45Z&sks=b&skv=2024-08-04&sig=FDA4aCPLkT4fMwAmm1yp/y4T06hMaIJ77mP2tGfWsJY%3D"
//             // alt="PantryChef Logo"
//             className="w-10 h-10 rounded-full shadow-md"
//           /> */}
//         <h1 className="text-2xl font-extrabold text-blue-500 tracking-wide">pantryChef</h1>

//         </Link>

//         {/* Right: Navigation + Auth Buttons */}
//         <div className="flex items-center space-x-6">
//           {token && (
//   <>
//     <Link to="/" className="text-black font-medium hover:text-gray-600 transition duration-200">Home</Link>
//     <Link to="/add-grocery" className="text-black font-medium hover:text-gray-600 transition duration-200">Add Grocery</Link>
//     <Link to="/profile" className="text-black font-medium hover:text-gray-600 transition duration-200">
//       <img
//         src="https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg"
//         alt="Profile"
//         className="w-8 h-8 rounded-full"
//       />
//     </Link>
//   </>
// )}

//           {!token ? (
//             <>
//               <Link
//                 to="/login"
//                 className="bg-white text-black border border-black font-semibold px-4 py-2 rounded-md hover:bg-black hover:text-white transition duration-200"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-white text-black border border-black font-semibold px-4 py-2 rounded-md hover:bg-black hover:text-white transition duration-200"
//               >
//                 Signup
//               </Link>
//             </>
//           ) : (
//             <button
//   onClick={handleLogout}
//   className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-200"
// >
//   Logout
// </button>

//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


// // src/components/NavBar.jsx
// import React, { useEffect, useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { GiHamburgerMenu } from "react-icons/gi";
// import { IoClose } from "react-icons/io5";
// import { CgProfile } from "react-icons/cg";
// import axios from "axios";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLogin, setIsLogin] = useState(false);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   useEffect(() => {
//     const checkLogin = async () => {
//       try {
//         const res = await axios.get("http://localhost:2806/user/", {
//           withCredentials: true,
//         });
//         if (res.status === 200) setIsLogin(true);
//       } catch (error) {
//         console.log("User not logged in");
//       }
//     };
//     checkLogin();
//   }, []);

//   return (
//     <nav className="bg-green-600 shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo + Brand */}
//           <NavLink to="/" className="flex items-center space-x-2">
//             <img
//               src="/logo.png" // Replace with your actual logo path
//               alt="PantryChef"
//               className="w-10 h-10 rounded-full"
//             />
//             <span className="text-white font-extrabold text-xl">PantryChef</span>
//           </NavLink>

//           {/* Hamburger (mobile only) */}
//           <div className="md:hidden">
//             <button onClick={toggleMenu} className="text-white focus:outline-none">
//               {isOpen ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
//             </button>
//           </div>

//           {/* Desktop Nav Links */}
//           <div className="hidden md:flex md:items-center space-x-6">
//             <NavLink to="/" className="text-white hover:text-gray-200">Home</NavLink>
//             <NavLink to="/add-grocery" className="text-white hover:text-gray-200">Add Grocery</NavLink>
//             <NavLink to="/profile" className="text-white hover:text-gray-200">Profile</NavLink>
//             {isLogin ? (
//               <NavLink to="/profile" className="text-white">
//                 <CgProfile size={28} />
//               </NavLink>
//             ) : (
//               <>
//                 <NavLink to="/login" className="bg-white text-green-700 font-semibold px-4 py-2 rounded hover:bg-gray-100">
//                   Login
//                 </NavLink>
//                 <NavLink to="/signup" className="bg-white text-green-700 font-semibold px-4 py-2 rounded hover:bg-gray-100">
//                   Signup
//                 </NavLink>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden px-4 pb-4 space-y-2">
//           <NavLink to="/" onClick={toggleMenu} className="block text-white py-2">Home</NavLink>
//           <NavLink to="/add-grocery" onClick={toggleMenu} className="block text-white py-2">Add Grocery</NavLink>
//           <NavLink to="/profile" onClick={toggleMenu} className="block text-white py-2">Profile</NavLink>
//           {isLogin ? (
//             <NavLink to="/profile" onClick={toggleMenu} className="block text-white py-2">
//               <CgProfile size={24} />
//             </NavLink>
//           ) : (
//             <>
//               <NavLink to="/login" onClick={toggleMenu} className="block text-white py-2">Login</NavLink>
//               <NavLink to="/signup" onClick={toggleMenu} className="block text-white py-2">Signup</NavLink>
//             </>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;



import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  // Check token on mount and on token change
  useEffect(() => {
    setToken(Cookies.get('accesstoken'));
  }, [Cookies.get('accesstoken')]);

  const handleLogout = () => {
    Cookies.remove('accesstoken');
    setToken(null); // Update token state
    navigate('/login');
  };

  return (
    <nav className="bg-green py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo + Brand Name */}
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-extrabold text-blue-500 tracking-wide">pantryChef</h1>
        </Link>

        {/* Right: Nav Buttons */}
        <div className="flex items-center space-x-6">
          {/* {console.log(token)} */}
          {token ? (
            <>
              <Link to="/" className="text-black font-medium hover:text-gray-600">Home</Link>
              <Link to="/add-grocery" className="text-black font-medium hover:text-gray-600">Add Grocery</Link>
              <Link to="/profile" className="text-black font-medium hover:text-gray-600">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-white text-black border border-black font-semibold px-4 py-2 rounded-md hover:bg-black hover:text-white">Login</Link>
              <Link to="/signup" className="bg-white text-black border border-black font-semibold px-4 py-2 rounded-md hover:bg-black hover:text-white">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
