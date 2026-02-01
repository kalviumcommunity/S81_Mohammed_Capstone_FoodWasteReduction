


// import React, { useState, useEffect } from 'react';
// import GroceryFilter from '../components/GroceryFilter';
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';

// const API_BASE = 'http://localhost:2806/grocery';

// function AddGrocery() {
//   const [name, setName] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [purchaseDate, setPurchaseDate] = useState('');
//   const [groceries, setGroceries] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//   const token = Cookies.get('accesstoken');
//   const user = token ? jwtDecode(token).id : null;

//   const fetchGroceries = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/user/${user}`);
//       const data = await res.json();
//       setGroceries(data || []);
//     } catch (err) {
//       setError('Failed to load groceries.');
//     }
//   };

//   useEffect(() => {
//     if (user) fetchGroceries();
//   }, [user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!name || quantity <= 0 || !purchaseDate) {
//       setError('Please fill in all fields correctly.');
//       return;
//     }

//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       const body = {
//         user,
//         name,
//         quantity,
//         purchaseDate,
//       };

//       const url = editId ? `${API_BASE}/update/${editId}` : `${API_BASE}/add`;

//       const res = await fetch(url, {
//         method: editId ? 'PUT' : 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       if (res.ok) {
//         setSuccess(editId ? 'Item updated!' : 'Item added!');
//         resetForm();
//         fetchGroceries();
//       } else {
//         setError('Failed to submit item.');
//       }
//     } catch (err) {
//       setError('Something went wrong.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setName('');
//     setQuantity(1);
//     setPurchaseDate('');
//     setEditId(null);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE}/delete/${id}`, {
//         method: 'DELETE',
//       });

//       if (res.ok) {
//         fetchGroceries(); // Refresh the list
//       } else {
//         setError('Delete failed.');
//       }
//     } catch (err) {
//       setError('Error deleting item.');
//     }
//   };

//   const handleEdit = (item) => {
//     setName(item.name);
//     setQuantity(item.quantity);
//     setPurchaseDate(item.purchaseDate.split('T')[0]);
//     setEditId(item._id);
//   };

//   return (
//     <div className="p-4 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-bold mb-4 text-center">{editId ? 'Update Item' : 'Add Grocery Item'}</h2>

//       {loading && <div className="text-center text-gray-500">Processing...</div>}
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       {success && <div className="text-green-500 mb-4">{success}</div>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <GroceryFilter onSelect={setName} selectedItem={name} />
//         <input
//           type="number"
//           placeholder="Quantity"
//           value={quantity}
//           onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
//           className="block w-full p-2 border border-gray-300 rounded-md"
//         />
//         <input
//           type="date"
//           value={purchaseDate}
//           onChange={(e) => setPurchaseDate(e.target.value)}
//           className="block w-full p-2 border border-gray-300 rounded-md"
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//           disabled={loading}
//         >
//           {loading ? 'Saving...' : editId ? 'Update Item' : 'Add Item'}
//         </button>
//       </form>

//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">Your Groceries</h3>
//         {groceries.length === 0 ? (
//           <p className="text-gray-500">No items yet.</p>
//         ) : (
//           groceries.map((item) => (
//             <div key={item._id} className="flex justify-between items-center mb-2 border p-2 rounded-md">
//               <div>
//                 <p><strong>{item.name}</strong> ({item.quantity})</p>
//                 <p className="text-sm text-gray-600">Purchased: {item.purchaseDate?.split('T')[0]}</p>
//                 <p className="text-sm text-red-600">
//                   Expires: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
//                 </p>
//                 <p className="text-sm italic">Tip: {item.storageTips || 'No tip available.'}</p>
//               </div>
//               <div className="space-x-2">
//                 <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Edit</button>
//                 <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline">Delete</button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default AddGrocery;





import React, { useState, useEffect } from 'react';
import GroceryFilter from '../components/GroceryFilter';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../config/api';

const API_BASE = API_ENDPOINTS.GROCERY;

// Mapping of grocery names to image URLs
const groceryImages = {
  "Tomato": "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb-732x549.jpg",
  "Onion": "https://www.allthatgrows.in/cdn/shop/products/Onion-Red_grande.jpg?v=1598081871",
  "Potato": "https://selal.ae/wp-content/uploads/2024/10/313dtY-LOEL.jpg",
  "Carrot": "https://www.jiomart.com/images/product/original/590000186/carrot-orange-500-g-product-images-o590000186-p590000186-0-202409171905.jpg?im=Resize=(1000,1000)",
  "Banana": "https://cdn-icons-png.flaticon.com/512/590/590681.png",
  "Apple": "https://cdn-icons-png.flaticon.com/512/590/590690.png",
  "Grapes": "https://cdn-icons-png.flaticon.com/512/590/590691.png",
  "Cucumber": "https://cdn-icons-png.flaticon.com/512/590/590679.png",
  "Garlic": "https://cdn-icons-png.flaticon.com/512/590/590695.png",
  "Ginger": "https://cdn-icons-png.flaticon.com/512/590/590693.png",
  "Bottle Gourd (Lauki)":"https://m.media-amazon.com/images/I/419Vx6EB9OL._AC_UF1000,1000_QL80_.jpg",
};

function AddGrocery() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [groceries, setGroceries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const token = Cookies.get('accesstoken');
  const user = token ? jwtDecode(token).id : null;

  const fetchGroceries = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/${user}`);
      const data = await res.json();
      setGroceries(data || []);
    } catch (err) {
      setError('Failed to load groceries.');
    }
  };

  useEffect(() => {
    if (user) fetchGroceries();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || quantity <= 0 || !purchaseDate) {
      setError('Please fill in all fields correctly.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const body = { user, name, quantity, purchaseDate };
      const url = editId ? `${API_BASE}/update/${editId}` : `${API_BASE}/add`;

      const res = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccess(editId ? 'Item updated!' : 'Item added!');
        resetForm();
        fetchGroceries();
      } else {
        setError('Failed to submit item.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setQuantity(1);
    setPurchaseDate('');
    setEditId(null);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchGroceries();
      } else {
        setError('Delete failed.');
      }
    } catch (err) {
      setError('Error deleting item.');
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setQuantity(item.quantity);
    setPurchaseDate(item.purchaseDate.split('T')[0]);
    setEditId(item._id);
  };
 return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {editId ? 'Update Grocery Item' : 'Add New Grocery'}
            </h2>
            <p className="text-gray-600 mt-2 text-sm">Keep track of your pantry items and reduce waste</p>
          </div>

          {/* Status Messages */}
          {loading && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-6 fade-in">
              <p className="text-sm font-medium">Processing your request...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 fade-in">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-600 text-green-700 p-4 rounded mb-6 fade-in">
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Select Grocery Item
              </label>
              <GroceryFilter onSelect={setName} selectedItem={name} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white font-medium py-3 rounded hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              {loading ? 'Processing...' : editId ? 'Update Item' : 'Add Item'}
            </button>
          </form>

          {/* Groceries List */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">
              Your Groceries
            </h3>
            
            {groceries.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center">
                <div className="text-5xl mb-3 text-gray-300">🛒</div>
                <p className="text-gray-700 font-medium">No items added yet</p>
                <p className="text-gray-500 text-sm mt-1">Start adding groceries to track them</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groceries.map((item, index) => {
                  const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                  const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0;
                  const isExpired = daysUntilExpiry <= 0;

                  return (
                    <div
                      key={item._id}
                      className={`bg-white border rounded shadow-sm p-4 card-hover fade-in border-l-4 ${
                        isExpired ? 'border-l-red-600' : isExpiringSoon ? 'border-l-orange-500' : 'border-l-gray-400'
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <img
                            src={groceryImages[item.name] || "https://via.placeholder.com/60"}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded border border-gray-200"
                          />
                          <div className="flex-1">
                            <p className="text-base font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Quantity: <span className="font-medium">{item.quantity}</span>
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2 text-xs">
                              <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded">
                                {item.purchaseDate?.split('T')[0]}
                              </span>
                              <span className={`px-2 py-1 rounded border ${
                                isExpired ? 'bg-red-50 text-red-700 border-red-200' : 
                                isExpiringSoon ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                                'bg-gray-100 text-gray-700 border-gray-200'
                              }`}>
                                Exp: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            {item.storageTips && (
                              <p className="text-xs text-gray-500 mt-2 bg-gray-50 border border-gray-200 p-2 rounded">
                                {item.storageTips}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-gray-900 text-white px-3 py-2 rounded hover:bg-gray-800 text-xs font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-xs font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddGrocery;

