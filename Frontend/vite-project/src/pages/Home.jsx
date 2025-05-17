// import React, { useEffect, useState } from 'react';
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';

// function Home() {
//   const [groceries, setGroceries] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = Cookies.get('accesstoken');
//         if (!token) return;
//         console.log(token)
//         const decoded = jwtDecode(token);
//         const userId = decoded.id;

//        const res = await fetch(`http://localhost:2806/grocery/user/${userId}`);

//         const data = await res.json();
//         setGroceries(data);
//       } catch (err) {
//         console.error('Failed to fetch groceries:', err);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-10">
//       {/* Summary Box */}
//       <div className="bg-white shadow-md rounded-lg p-6 mb-8 border-l-4 border-blue-500">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to PantryChef!</h1>
//         <p className="text-gray-600">Track your grocery items and reduce food waste with smart expiry tracking.</p>
//       </div>

//       {/* Item Details Header */}
//       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Grocery Items</h2>

//       {/* Grocery Item Cards */}
//       <div className="grid gap-6">
//         {groceries.map((item) => (
//   <div
//     key={item._id}
//     className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300"
//   >
//     <div className="flex justify-between items-center mb-4">
//       <h3 className="text-xl font-bold text-gray-800">{item.itemName}</h3>
//       <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
//         Quantity: {item.quantity}
//       </span>
//     </div>

//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
//       <div>
//         <p><span className="font-semibold">Purchased on:</span> {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}</p>
//       </div>
//       <div>
//         <p>
//           <span className="font-semibold">Expires on:</span>
//           <span className="text-red-500 font-medium"> {item.estimatedExpiry ? new Date(item.estimatedExpiry).toLocaleDateString() : 'N/A'}</span>
//         </p>
//       </div>
//       <div className="sm:col-span-2">
//         <p><span className="font-semibold">Storage Tip:</span> {item.storageTip || 'No tips available.'}</p>
//       </div>
//     </div>
//   </div>
// ))}

//       </div>
//     </div>
//   );
// }

// export default Home;



import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function Home() {
  const [groceries, setGroceries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accesstoken');
        if (!token) return;
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await fetch(`http://localhost:2806/grocery/user/${userId}`);
        const data = await res.json();
        setGroceries(data);
      } catch (err) {
        console.error('Failed to fetch groceries:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-10">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 border-l-4 border-blue-500">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to PantryChef!</h1>
        <p className="text-gray-600">Track your grocery items and reduce food waste with smart expiry tracking.</p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Grocery Items</h2>

      <div className="grid gap-6">
       {groceries.map((item) => (
  <div key={item._id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300">
    {/* Display Item Name */}
    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.itemName}</h3>

    {/* Quantity */}
    <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
      Quantity: {item.quantity}
    </span>

    {/* Purchased and expiry dates */}
    <div className="mt-4 flex justify-between text-gray-700">
      <p>
        <strong>Purchased on:</strong> {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}
      </p>
      <p>
        <strong>Expires on:</strong>{' '}
        <span className="text-red-500 font-medium">
          {item.estimatedExpiry ? new Date(item.estimatedExpiry).toLocaleDateString() : 'N/A'}
        </span>
      </p>
    </div>

    {/* Storage tip */}
    <p className="mt-2"><strong>Storage Tip:</strong> {item.storageTip || 'No tips available.'}</p>
  </div>
))}

      </div>
    </div>
  );
}

export default Home;
