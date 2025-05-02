import React, { useState } from "react";

const availableGroceries = [
  "Milk",
  "Bread",
  "Apple",
  "Banana",
  "Potato",
  "Tomato",
  "Rice",
  "Eggs",
  "Butter",
  "Cheese",
];

function SearchBox({ onItemAdd }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Filter available groceries based on search
    if (value.length > 0) {
      setSuggestions(
        availableGroceries.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleItemSelect = (item) => {
    onItemAdd(item); // Pass the selected item to the parent component
    setSearch(""); // Clear the search box after selection
    setSuggestions([]); // Clear the suggestions
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search for groceries..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
      />
      {suggestions.length > 0 && (
        <ul className="bg-white border rounded-md max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleItemSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBox;
