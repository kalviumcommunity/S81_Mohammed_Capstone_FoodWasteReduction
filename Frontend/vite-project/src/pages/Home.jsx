import React, { useEffect, useState } from 'react';
        import Cookies from 'js-cookie';
        import { jwtDecode } from 'jwt-decode';
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

        const res = await fetch(`http://localhost:2806/grocery/user/${userId}`);
        const data = await res.json();
        setGroceries(data?.groceries || data);
      } catch (err) {
        console.error('Failed to fetch groceries:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      // style={{
      //   backgroundImage: `url('https://media.istockphoto.com/id/1145640968/photo/eco-bag-with-zero-waste-shopping-fruit-vegetables-cereals.jpg?s=612x612&w=0&k=20&c=fbTrF256ZJGLdhmEH7qECCuDdkro3Zcuc7DM9abzRfs=')`
      // }}
    >
      <div className="bg-white/20 flex-grow py-8 px-4 md:px-10">
        {/* Welcome Banner */}
        <div className="bg-white shadow-xl rounded-lg p-6 mb-8 border-l-4 border-blue-500">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to PantryChef!</h1>
          <p className="text-gray-700">Track your grocery items and reduce food waste with smart expiry tracking.</p>
        </div>

        {/* Grocery Items */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Grocery Items</h2>

        <div className="grid gap-6">
          {groceries.length === 0 ? (
            <p className="text-gray-600 bg-white/70 p-4 rounded-md shadow">No grocery added.</p>
          ) : (
            groceries.map((item) => (
              <div
                key={item._id}
                className="bg-white/100 rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={groceryImages[item.name] || "https://via.placeholder.com/40"}
                      alt={item.name}
                      className="w-10 h-10 object-contain rounded"
                    />
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                  </div>
                  <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    Quantity: {item.quantity}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p>
                      <span className="font-semibold">Purchased on:</span>{' '}
                      {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Expires on:</span>{' '}
                      <span className="text-red-500 font-medium">
                        {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p>
                      <span className="font-semibold">Storage Tip:</span>{' '}
                      {item.storageTips || 'No tips available.'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white text-black text-center py-4">
  <p className="mb-2">Made by Mohammed Shammas</p>
  <div className="flex justify-center gap-6 text-blue-600">
    <a
      href="https://www.linkedin.com/in/mohammed-shammas-uddin-61ba57353/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline hover:text-blue-800"
    >
      LinkedIn
    </a>
    <a
      href="https://www.instagram.com/itz__shammas/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline hover:text-pink-600"
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

        
