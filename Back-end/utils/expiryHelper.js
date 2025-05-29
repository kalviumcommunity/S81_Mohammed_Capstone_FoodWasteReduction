function estimateExpiry(name, purchaseDate) {
    const days = {
      // Vegetables
      // Leafy Greens
      "Spinach": 5,
      "Kale": 7,
      "Lettuce (Romaine, Iceberg, etc.)": 5,
      "Coriander (Cilantro)": 3,
      "Fenugreek leaves (Methi)": 5,
      "Mustard greens (Sarson)": 5,
      "Amaranth leaves": 5,
      "Curry leaves": 5,
      "Mint": 5,
  
      // Root Vegetables
      "Potato": 14,
      "Sweet Potato": 14,
      "Carrot": 14,
      "Beetroot": 10,
      "Radish (White & Red)": 7,
      "Turnip": 10,
      "Yam": 14,
  
      // Gourds & Squashes
      "Bottle Gourd (Lauki)": 7,
      "Bitter Gourd (Karela)": 5,
      "Ridge Gourd (Turai)": 5,
      "Snake Gourd": 5,
      "Ash Gourd": 10,
      "Pumpkin": 15,
      "Zucchini": 7,
      "Cucumber": 7,
  
      // Other Common Vegetables
      "Tomato": 7,
      "Onion": 14,
      "Garlic": 14,
      "Ginger": 14,
      "Green Chili": 7,
      "Bell Pepper (Capsicum)": 7,
      "Brinjal (Eggplant)": 7,
      "Okra (Ladyfinger/Bhindi)": 7,
      "Cabbage": 14,
      "Cauliflower": 7,
      "Broccoli": 7,
      "Green Beans": 7,
      "Peas (Fresh or Frozen)": 7,
      "Corn (Sweet Corn)": 7,
      "Drumstick (Moringa)": 7,
  
      // Exotic / Less Common
      "Avocado": 7,
      "Artichoke": 7,
      "Leeks": 10,
      "Celery": 7,
      "Bok Choy": 5,
      "Asparagus": 5,
      "Mushrooms": 5,
  
      // Fruits
      // Citrus
      "Orange": 10,
      "Sweet Lime (Mosambi)": 7,
      "Lemon": 10,
      "Tangerine": 10,
      "Grapefruit": 10,
  
      // Berries
      "Strawberry": 5,
      "Blueberry": 5,
      "Raspberry": 5,
      "Blackberry": 5,
  
      // Tropical Fruits
      "Mango": 7,
      "Banana": 5,
      "Papaya": 7,
      "Pineapple": 10,
      "Guava": 7,
      "Coconut": 15,
      "Lychee": 7,
      "Sapota (Chikoo)": 7,
      "Jackfruit": 10,
  
      // Stone Fruits
      "Apple": 14,
      "Pear": 14,
      "Peach": 7,
      "Plum": 7,
      "Apricot": 7,
      "Cherry": 7,
      "Nectarine": 7,
  
      // Melons
      "Watermelon": 7,
      "Muskmelon": 7,
      "Cantaloupe": 7,
      "Honeydew": 7,
  
      // Grapes & Others
      "Grapes (Green/Black/Red)": 7,
      "Pomegranate": 10,
      "Kiwi": 7,
      "Fig": 7,
      "Dates": 15
    };
  
    const date = new Date(purchaseDate);
    date.setDate(date.getDate() + (days[name] || 7)); // Default to 7 days if not found
    return date;
  }
  
  function getStorageTip(name) {
    const tips = {
      "Milk": "Store in refrigerator below 4°C",
      "Bread": "Keep in a cool dry place",
      "Apple": "Refrigerate to keep fresh for longer",
      "Banana": "Keep at room temperature",
      "Potato": "Store in a dark, dry place",
      "Tomato": "Keep in room temperature away from direct sunlight",
      "Rice": "Store in airtight container in a cool place",
      "Cucumber": "Store in the fridge for extended freshness",
      "Mango": "Keep at room temperature until ripe, then refrigerate"
    };
    return tips[name] || "Store properly to extend shelf life";
  }
  
  export default { estimateExpiry, getStorageTip };