import React, { useState, useEffect } from 'react';
import GroceryFilter from '../components/GroceryFilter';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const API_BASE = 'http://localhost:2806/grocery/user';

// Normalize item name to capitalized form
function normalizeItemName(name) {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Calculate expiry date based on purchase date and item
function calculateExpiry(name, purchaseDate) {
  const expiryDays = {
    Spinach: 5,
    Kale: 7,
    Potato: 30,
    Tomato: 7,
    Onion: 30,
    Carrot: 14,
    Broccoli: 7,
    Apple: 30,
    Banana: 5,
    // Add more items and their expiry days here
  };

  const days = expiryDays[name] || 10; // default 10 days expiry
  const purchase = new Date(purchaseDate);
  purchase.setDate(purchase.getDate() + days);
  return purchase.toISOString();
}

// Storage tips dictionary
function getStorageTip(name) {
  const tips = {
    Spinach: 'Keep in fridge in a sealed container.',
    Potato: 'Store in a cool, dark place.',
    Tomato: 'Keep at room temperature away from sunlight.',
    Onion: 'Store in a dry, ventilated area.',
    Kale: 'Wrap in paper towels and store in a plastic bag in the fridge.',
    Carrot: 'Store in a refrigerator drawer in a plastic bag.',
    Broccoli: 'Keep in an open plastic bag in the fridge.',
    Apple: 'Store in a cool place or refrigerator drawer.',
    Banana: 'Keep at room temperature; separate from other fruits.',
    // Add more tips here
  };

  return tips[name] || 'Try storing in a cool, dry place.';
}

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
     const res = await fetch(`${API_BASE}/${user}`);
      const data = await res.json();
      setGroceries(data.groceries || data); // adjust depending on API response
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
      const normalizedName = normalizeItemName(name);
      const estimatedExpiry = calculateExpiry(normalizedName, purchaseDate);
      const storageTip = getStorageTip(normalizedName);

      const body = {
       user: user,
        name: name,
        quantity,
        purchaseDate,
        expiryDate: estimatedExpiry,
        storageTips: storageTip,
      };

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
      const res = await fetch(`${API_BASE}/delete/${id}`, { method: 'DELETE' }); // DELETE /grocery/delete/:id


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
    <div className="p-4 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">{editId ? 'Update Item' : 'Add Grocery Item'}</h2>

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
            <div key={item._id} className="flex justify-between items-center mb-2 border p-2 rounded-md">
              <div>
                <p><strong>{item.name}</strong> ({item.quantity})</p>
                <p className="text-sm text-gray-600">Purchased: {item.purchaseDate.split('T')[0]}</p>
                <p className="text-sm text-red-600">
                  Expires: {item.estimatedExpiry ? new Date(item.estimatedExpiry).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-sm italic">Tip: {item.storageTip}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AddGrocery;
