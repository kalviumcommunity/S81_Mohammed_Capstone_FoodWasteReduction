


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

const API_BASE = 'http://localhost:2806/grocery';

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
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{
        backgroundImage:
          'url("https://wallpapercave.com/wp/wp10400986.jpg")',
      }}
    >
      <div className="w-full max-w-lg bg-white bg-opacity-40 shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">
          {editId ? 'Update Item' : 'Add Grocery Item'}
        </h2>

        {loading && <div className="text-center text-gray-500">Processing...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <GroceryFilter onSelect={setName} selectedItem={name} />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : editId ? 'Update Item' : 'Add Item'}
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Your Groceries</h3>
          {groceries.length === 0 ? (
            <p className="text-gray-500">No items yet.</p>
          ) : (
            groceries.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-start gap-4 mb-2 border p-2 rounded-md bg-white bg-opacity-80"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={groceryImages[item.name] || "https://via.placeholder.com/40"}
                    alt={item.name}
                    className="w-10 h-10 object-contain rounded"
                  />
                  <div>
                    <p>
                      <strong>{item.name}</strong> ({item.quantity})
                    </p>
                    <p className="text-sm text-gray-600">
                      Purchased: {item.purchaseDate?.split('T')[0]}
                    </p>
                    <p className="text-sm text-red-600">
                      Expires:{' '}
                      {item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-sm italic">
                      Tip: {item.storageTips || 'No tip available.'}
                    </p>
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AddGrocery;

