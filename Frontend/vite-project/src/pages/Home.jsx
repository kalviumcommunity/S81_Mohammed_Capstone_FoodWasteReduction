import React, { useEffect, useState } from 'react';
        import Cookies from 'js-cookie';
        import { jwtDecode } from 'jwt-decode';
        import { API_ENDPOINTS } from '../config/api';
// Grocery image map
const groceryImages = {
  "Tomato": "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb-732x549.jpg",
  "Onion": "https://www.allthatgrows.in/cdn/shop/products/Onion-Red_grande.jpg?v=1598081871 ",
  "Potato": "https://www.kew.org/sites/default/files/styles/original/public/2025-01/many-potatoes-solanum-tuberosum.jpg.webp?itok=RhcGjOE3",
  "Carrot": "https://www.jiomart.com/images/product/original/590000186/carrot-orange-500-g-product-images-o590000186-p590000186-0-202409171905.jpg?im=Resize=(1000,1000)",
  "Banana": "https://nutritionsource.hsph.harvard.edu/wp-content/uploads/2018/08/bananas-1354785_1920.jpg",
  "Apple": "https://assets.clevelandclinic.org/transform/cd71f4bd-81d4-45d8-a450-74df78e4477a/Apples-184940975-770x533-1_jpg",
  "Grapes": "https://cdn-icons-png.flaticon.com/512/590/590691.png",
  "Cucumber": "https://cdn-icons-png.flaticon.com/512/590/590679.png",
  "Garlic": "https://cdn-icons-png.flaticon.com/512/590/590695.png",
  "Ginger": "https://cdn-icons-png.flaticon.com/512/590/590693.png",
  "Spinach": "https://greentokri.com/cdn/shop/files/Spinach_Bundle_AI_generated.jpg?v=1732439319",
  "Curry leaves":"https://www.jiomart.com/images/product/original/590000117/curry-leaves-1-bunch-approx-20-g-100-g-product-images-o590000117-p590000117-0-202409171907.jpg?im=Resize=(1000,1000)",
  "Bottle Gourd (Lauki)":"https://m.media-amazon.com/images/I/419Vx6EB9OL._AC_UF1000,1000_QL80_.jpg",
  "Dates":"https://assets.clevelandclinic.org/m/6ead307b9aabcb0f/webimage-dates-Fruit-Bowl-516816730-770x533-1_jpg.png",
  
};

function Home() {
  const [groceries, setGroceries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('accesstoken');
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await fetch(API_ENDPOINTS.GET_GROCERIES(userId));
        const data = await res.json();
        setGroceries(data?.groceries || data);
      } catch (err) {
        console.error('Failed to fetch groceries:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 md:px-10 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-8 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">
                Welcome to PantryChef
              </h1>
              <p className="text-gray-600">
                Track your grocery items and reduce food waste with smart expiry tracking.
              </p>
            </div>
            <div className="hidden md:block text-6xl text-gray-400">
              🥗
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Items</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{groceries.length}</p>
              </div>
              <div className="text-3xl text-gray-400">📦</div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Expiring Soon</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {groceries.filter(item => {
                    const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
                  }).length}
                </p>
              </div>
              <div className="text-3xl text-gray-400">⚠️</div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Fresh Items</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {groceries.filter(item => {
                    const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry > 3;
                  }).length}
                </p>
              </div>
              <div className="text-3xl text-gray-400">✓</div>
            </div>
          </div>
        </div>

        {/* Expiry Alerts Section */}
        {groceries.filter(item => {
          const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 3;
        }).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 fade-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔔</span>
              <h3 className="text-lg font-bold text-red-800">Expiry Alerts</h3>
            </div>
            <div className="grid gap-3">
              {groceries
                .filter(item => {
                  const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return daysUntilExpiry <= 3;
                })
                .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
                .map((item, index) => {
                  const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                  const isExpired = daysUntilExpiry <= 0;
                  const isToday = daysUntilExpiry === 0;
                  
                  return (
                    <div
                      key={item._id}
                      className={`flex items-center justify-between p-3 rounded ${
                        isExpired ? 'bg-red-100 border border-red-300' : 
                        isToday ? 'bg-red-100 border border-red-300' :
                        'bg-orange-100 border border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {isExpired ? '⛔' : isToday ? '🚨' : '⚠️'}
                        </span>
                        <div>
                          <p className={`font-semibold ${isExpired || isToday ? 'text-red-800' : 'text-orange-800'}`}>
                            {item.name}
                          </p>
                          <p className={`text-sm ${isExpired || isToday ? 'text-red-600' : 'text-orange-600'}`}>
                            {isExpired 
                              ? `Expired ${Math.abs(daysUntilExpiry)} day(s) ago!` 
                              : isToday 
                              ? 'Expires TODAY!' 
                              : `Expires in ${daysUntilExpiry} day(s)`}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        isExpired || isToday ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                      }`}>
                        Qty: {item.quantity}
                      </span>
                    </div>
                  );
                })}
            </div>
            <p className="text-sm text-red-600 mt-4 text-center">
              💡 Use these items first to avoid food waste!
            </p>
          </div>
        )}

        {/* Grocery Items */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
            Your Grocery Items
          </h2>

          <div className="grid gap-4">
            {groceries.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
                <div className="text-5xl mb-4 text-gray-300">🛍️</div>
                <p className="text-lg text-gray-700 font-medium">No groceries added yet</p>
                <p className="text-gray-500 mt-2 text-sm">Start adding items to track their freshness</p>
              </div>
            ) : (
              groceries.map((item, index) => {
                const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0;
                const isExpired = daysUntilExpiry <= 0;
                
                return (
                  <div
                    key={item._id}
                    className={`bg-white border rounded-lg shadow-sm p-6 card-hover border-l-4 fade-in ${
                      isExpired ? 'border-l-red-600' : isExpiringSoon ? 'border-l-orange-500' : 'border-l-gray-400'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                          <img
                            src={groceryImages[item.name] || "https://via.placeholder.com/60"}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded border border-gray-200"
                          />
                          {isExpiringSoon && (
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                              !
                            </span>
                          )}
                          {isExpired && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                              ✕
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs font-medium">
                              Qty: {item.quantity}
                            </span>
                            {isExpiringSoon && (
                              <span className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded text-xs font-medium">
                                Expiring Soon
                              </span>
                            )}
                            {isExpired && (
                              <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-medium">
                                Expired
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm md:max-w-md">
                        <div className="bg-gray-50 border border-gray-200 rounded p-2">
                          <p className="text-gray-600 text-xs font-medium mb-1">
                            Purchased
                          </p>
                          <p className="text-gray-900 font-medium">
                            {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className={`border rounded p-2 ${isExpired ? 'bg-red-50 border-red-200' : isExpiringSoon ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                          <p className={`text-xs font-medium mb-1 ${isExpired ? 'text-red-700' : isExpiringSoon ? 'text-orange-700' : 'text-gray-600'}`}>
                            Expires
                          </p>
                          <p className="text-gray-900 font-medium">
                            {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                          </p>
                          {daysUntilExpiry > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'} left
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {item.storageTips && (
                      <div className="mt-3 bg-gray-50 border border-gray-200 rounded p-3">
                        <p className="text-gray-700 text-xs font-medium mb-1">
                          Storage Tip:
                        </p>
                        <p className="text-gray-600 text-sm">
                          {item.storageTips}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-6 mt-12">
        <p className="text-gray-600 text-sm mb-3">Made by Mohammed Shammas</p>
        <div className="flex justify-center gap-6">
          <a
            href="https://www.linkedin.com/in/mohammed-shammas-uddin-61ba57353/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/itz__shammas/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Home;




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
        //         const decoded = jwtDecode(token);
        //         const userId = decoded.id;

        //         const res = await fetch(`http://localhost:2806/grocery/user/${userId}`);
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
        //       <div className="bg-white shadow-md rounded-lg p-6 mb-8 border-l-4 border-blue-500">
        //         <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to PantryChef!</h1>
        //         <p className="text-gray-600">Track your grocery items and reduce food waste with smart expiry tracking.</p>
        //       </div>

        //       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Grocery Items</h2>

        //       <div className="grid gap-6">
        //        {groceries.map((item) => (
        //   <div key={item._id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300">
        //     {/* Display Item Name */}
        //     <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>

        //     {/* Quantity */}
        //     <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
        //       Quantity: {item.quantity}
        //     </span>

        //     {/* Purchased and expiry dates */}
        //     <div className="mt-4 flex justify-between text-gray-700">
        //       <p>
        //         <strong>Purchased on:</strong> {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}
        //       </p>
        //       <p>
        //         <strong>Expires on:</strong>{' '}
        //         <span className="text-red-500 font-medium">
        //           {item.estimatedExpiry ? new Date(item.estimatedExpiry).toLocaleDateString() : 'N/A'}
        //         </span>
        //       </p>
        //     </div>

        //     {/* Storage tip */}
        //     <p className="mt-2"><strong>Storage Tip:</strong> {item.storageTip || 'No tips available.'}</p>
        //   </div>
        // ))}

        //       </div>
        //     </div>
        //   );
        // }

        // export default Home;

        
