import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const items = ["Apple", "Banana", "Bread", "Milk", "Potato", "Rice", "Tomato"];

function GroceryFilter({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get('accesstoken');  // Assuming the token is stored in cookies.

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm]);

  const handleSelect = (e) => {
    const value = e.target.value;
    if (value) onSelect(value);
  };

  const fetchItems = async () => {
    if (!token) {
      console.log("Token not found, please log in.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/groceries', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setFilteredItems(data.items || []);
      } else {
        console.error('Failed to fetch groceries');
      }
    } catch (err) {
      console.error('Error fetching groceries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(); // Fetch items when the component mounts (optional, depending on your app's flow).
  }, [token]);

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search grocery item..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full p-2 mb-2 border border-gray-300 rounded-md"
      />

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <select
          onChange={handleSelect}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Item</option>
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))
          ) : (
            <option disabled>No items found</option>
          )}
        </select>
      )}
    </div>
    
  );
}

export default GroceryFilter;
