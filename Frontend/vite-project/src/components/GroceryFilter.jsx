import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function GroceryFilter({ onSelect, selectedItem }) {
  const [items, setItems] = useState([]);
  const token = Cookies.get('accesstoken');

  // Predefined fallback items from estimateExpiry keys
  const fallbackItems = [
    "Spinach", "Kale", "Lettuce (Romaine, Iceberg, etc.)", "Coriander (Cilantro)", 
  "Fenugreek leaves (Methi)", "Mustard greens (Sarson)", "Amaranth leaves", 
  "Curry leaves", "Mint", "Potato", "Sweet Potato", "Carrot", "Beetroot",
  "Radish (White & Red)", "Turnip", "Yam", "Bottle Gourd (Lauki)", 
  "Bitter Gourd (Karela)", "Ridge Gourd (Turai)", "Snake Gourd", "Ash Gourd",
  "Pumpkin", "Zucchini", "Cucumber", "Tomato", "Onion", "Garlic", "Ginger",
  "Green Chili", "Bell Pepper (Capsicum)", "Brinjal (Eggplant)", "Okra (Ladyfinger/Bhindi)",
  "Cabbage", "Cauliflower", "Broccoli", "Green Beans", "Peas (Fresh or Frozen)",
  "Corn (Sweet Corn)", "Drumstick (Moringa)", "Avocado", "Artichoke", "Leeks",
  "Celery", "Bok Choy", "Asparagus", "Mushrooms", "Orange", "Sweet Lime (Mosambi)",
  "Lemon", "Tangerine", "Grapefruit", "Strawberry", "Blueberry", "Raspberry",
  "Blackberry", "Mango", "Banana", "Papaya", "Pineapple", "Guava", "Coconut",
  "Lychee", "Sapota (Chikoo)", "Jackfruit", "Apple", "Pear", "Peach", "Plum",
  "Apricot", "Cherry", "Nectarine", "Watermelon", "Muskmelon", "Cantaloupe",
  "Honeydew", "Grapes (Green/Black/Red)", "Pomegranate", "Kiwi", "Fig", "Dates"
  ];

  useEffect(() => {
    if (!token) {
      console.warn('Token not found, please log in.');
      setItems(fallbackItems);
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (error) {
      console.error('Invalid token:', error);
      setItems(fallbackItems);
      return;
    }

    const fetchItems = async () => {
      try {
       const res = await fetch(`http://localhost:2806/grocery/${user}`);

;
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const namesFromDB = data.map((item) => item.name); // extract names
        const mergedItems = Array.from(new Set([...namesFromDB, ...fallbackItems]));

        setItems(mergedItems);
      } catch (err) {
        console.error('Failed to fetch filter items:', err.message);
        setItems(fallbackItems);
      }
    };

    fetchItems();
  }, [token]);

  return (
    <select
      className="block w-full p-2 border border-gray-300 rounded-md"
      value={selectedItem}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Select Item</option>
      {items.map((item, i) => (
        <option key={i} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

export default GroceryFilter;
