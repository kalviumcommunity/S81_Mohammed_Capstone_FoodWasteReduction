import React, { useState } from 'react';
import GroceryFilter from '../components/GroceryFilter';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function AddGrocery() {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields or invalid input
    if (!itemName || quantity <= 0 || !purchaseDate) {
      setError('Please fill in all fields correctly.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = Cookies.get('accesstoken');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const res = await fetch('/api/groceries/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemName, quantity, purchaseDate }),
      });

      if (res.ok) {
        setSuccess('Item added successfully!');
        setItemName('');
        setQuantity(1);
        setPurchaseDate('');
      } else {
        setError('Error adding item. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Add Grocery Item</h2>

      {loading && <div className="text-center text-gray-500">Adding item...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <GroceryFilter onSelect={setItemName} />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, e.target.value))}
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
          className="w-full bg--600 text-black px-4 py-2 rounded-md hover:bg-white-700 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}

export default AddGrocery;
