import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../config/api';

function GroceryFilter({ onSelect, selectedItem }) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
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

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        const res = await fetch(API_ENDPOINTS.GET_GROCERIES(userId));
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const namesFromDB = data.map((item) => item.name);
        const mergedItems = Array.from(new Set([...namesFromDB, ...fallbackItems]));
        setItems(mergedItems);
      } catch (err) {
        console.error('Failed to fetch filter items:', err.message);
        setItems(fallbackItems);
      }
    };

    fetchItems();
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update search term when selected item changes externally
  useEffect(() => {
    if (selectedItem) {
      setSearchTerm(selectedItem);
    } else {
      setSearchTerm('');
    }
  }, [selectedItem]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (e.target.value === '') {
      onSelect('');
    }
  };

  const handleSelect = (item) => {
    setSearchTerm(item);
    onSelect(item);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
          handleSelect(filteredItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search groceries..."
          className="w-full pl-10 pr-10 py-3 border border-blue-200 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              onSelect('');
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <svg className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-blue-200 rounded shadow-lg max-h-60 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-sm text-center">
              No items found
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelect(item)}
                className={`px-4 py-3 cursor-pointer text-sm transition-colors ${
                  highlightedIndex === index 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'text-gray-700 hover:bg-blue-50'
                } ${selectedItem === item ? 'bg-blue-50 font-medium text-blue-600' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </span>
                  {item}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
        );
      }

      export default GroceryFilter;


