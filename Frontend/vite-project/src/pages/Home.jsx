import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

function Home() {
  const [groceries, setGroceries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accesstoken');
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await fetch(`/api/groceries/${userId}`);
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
      <h1 className="text-3xl font-bold text-green-700 mb-6">Your Groceries</h1>
      <div className="grid gap-4">
        {groceries.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-lg p-5 border-l-4 border-green-500"
          >
            <h2 className="text-xl font-semibold text-gray-800">{item.itemName}</h2>
            <p className="text-gray-600">
              <span className="font-medium">Quantity:</span> {item.quantity}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Bought on:</span>{' '}
              {new Date(item.purchaseDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Expires on:</span>{' '}
              <span className="text-red-500 font-semibold">
                {new Date(item.estimatedExpiry).toLocaleDateString()}
              </span>
            </p>
            <p className="text-gray-600 italic">
              <span className="font-medium not-italic">Storage Tip:</span> {item.storageTip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
