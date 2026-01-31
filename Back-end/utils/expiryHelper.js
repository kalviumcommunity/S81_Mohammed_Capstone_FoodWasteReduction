function estimateExpiry(name, purchaseDate) {
    // More accurate shelf life in days based on proper storage conditions
    const shelfLife = {
      // Vegetables
      // Leafy Greens (refrigerated)
      "Spinach": 5,
      "Kale": 7,
      "Lettuce (Romaine, Iceberg, etc.)": 7,
      "Coriander (Cilantro)": 7,
      "Fenugreek leaves (Methi)": 4,
      "Mustard greens (Sarson)": 5,
      "Amaranth leaves": 3,
      "Curry leaves": 14,
      "Mint": 7,
  
      // Root Vegetables (cool, dark place)
      "Potato": 21,
      "Sweet Potato": 21,
      "Carrot": 21,
      "Beetroot": 14,
      "Radish (White & Red)": 14,
      "Turnip": 14,
      "Yam": 21,
  
      // Gourds & Squashes
      "Bottle Gourd (Lauki)": 10,
      "Bitter Gourd (Karela)": 5,
      "Ridge Gourd (Turai)": 5,
      "Snake Gourd": 7,
      "Ash Gourd": 30,
      "Pumpkin": 60,
      "Zucchini": 7,
      "Cucumber": 7,
  
      // Other Common Vegetables
      "Tomato": 7,
      "Onion": 30,
      "Garlic": 60,
      "Ginger": 21,
      "Green Chili": 7,
      "Bell Pepper (Capsicum)": 10,
      "Brinjal (Eggplant)": 5,
      "Okra (Ladyfinger/Bhindi)": 3,
      "Cabbage": 14,
      "Cauliflower": 7,
      "Broccoli": 5,
      "Green Beans": 7,
      "Peas (Fresh or Frozen)": 5,
      "Corn (Sweet Corn)": 3,
      "Drumstick (Moringa)": 7,
  
      // Exotic / Less Common
      "Avocado": 5,
      "Artichoke": 7,
      "Leeks": 14,
      "Celery": 14,
      "Bok Choy": 4,
      "Asparagus": 4,
      "Mushrooms": 5,
  
      // Fruits
      // Citrus (room temp or refrigerated)
      "Orange": 21,
      "Sweet Lime (Mosambi)": 14,
      "Lemon": 21,
      "Tangerine": 14,
      "Grapefruit": 21,
  
      // Berries (refrigerated)
      "Strawberry": 5,
      "Blueberry": 10,
      "Raspberry": 3,
      "Blackberry": 3,
  
      // Tropical Fruits
      "Mango": 5,
      "Banana": 5,
      "Papaya": 5,
      "Pineapple": 5,
      "Guava": 4,
      "Coconut": 30,
      "Lychee": 5,
      "Sapota (Chikoo)": 4,
      "Jackfruit": 5,
  
      // Stone Fruits (refrigerated)
      "Apple": 30,
      "Pear": 7,
      "Peach": 5,
      "Plum": 5,
      "Apricot": 4,
      "Cherry": 5,
      "Nectarine": 5,
  
      // Melons
      "Watermelon": 7,
      "Muskmelon": 5,
      "Cantaloupe": 5,
      "Honeydew": 7,
  
      // Grapes & Others
      "Grapes (Green/Black/Red)": 7,
      "Pomegranate": 14,
      "Kiwi": 7,
      "Fig": 3,
      "Dates": 180,

      // Dairy & Eggs
      "Milk": 7,
      "Curd (Yogurt)": 7,
      "Paneer": 7,
      "Cheese": 21,
      "Butter": 30,
      "Eggs": 21,
      "Cream": 7,

      // Bread & Bakery
      "Bread": 5,
      "Pav": 3,
      "Cake": 3,
      "Biscuits": 60,

      // Grains & Pulses (dry storage)
      "Rice": 180,
      "Wheat": 180,
      "Dal (Lentils)": 180,
      "Chickpeas": 180,
      "Rajma (Kidney Beans)": 180,

      // Meat & Seafood (refrigerated)
      "Chicken": 2,
      "Mutton": 3,
      "Fish": 2,
      "Prawns": 2,
      "Eggs": 21
    };
  
    const date = new Date(purchaseDate);
    const days = shelfLife[name] || 7; // Default to 7 days if not found
    date.setDate(date.getDate() + days);
    return date;
  }
  
  function getStorageTip(name) {
    const tips = {
      // Vegetables
      "Spinach": "Wrap in paper towel and store in airtight container in fridge",
      "Kale": "Remove stems, wash, dry, and store in sealed bag with paper towel",
      "Lettuce (Romaine, Iceberg, etc.)": "Wrap in damp paper towel and store in crisper drawer",
      "Coriander (Cilantro)": "Place stems in water like flowers, cover with plastic bag, refrigerate",
      "Fenugreek leaves (Methi)": "Wrap in newspaper and store in fridge",
      "Curry leaves": "Store in airtight container in freezer for longer shelf life",
      "Mint": "Store stems in water, cover with plastic bag, refrigerate",
      "Potato": "Store in cool, dark, dry place. Avoid refrigerator - causes sweetness",
      "Sweet Potato": "Store in cool, dark place. Do not refrigerate",
      "Carrot": "Remove tops, store in plastic bag in fridge crisper drawer",
      "Beetroot": "Remove leaves, store unwashed in plastic bag in fridge",
      "Onion": "Store in cool, dry, well-ventilated area. Keep away from potatoes",
      "Garlic": "Store in cool, dark place with good air circulation",
      "Ginger": "Store unpeeled in fridge, or freeze for longer storage",
      "Tomato": "Store at room temperature away from sunlight until ripe, then refrigerate",
      "Cucumber": "Wrap in paper towel, store in plastic bag in fridge",
      "Bell Pepper (Capsicum)": "Store unwashed in crisper drawer of fridge",
      "Cabbage": "Wrap tightly in plastic wrap, store in crisper drawer",
      "Cauliflower": "Store stem-side down in open plastic bag in fridge",
      "Broccoli": "Store unwashed in open plastic bag in crisper drawer",
      "Mushrooms": "Store in paper bag in fridge, never in plastic",
      
      // Fruits
      "Apple": "Store in crisper drawer. Keep away from other fruits - releases ethylene",
      "Banana": "Store at room temperature. Separate to slow ripening",
      "Mango": "Keep at room temperature until ripe, then refrigerate",
      "Orange": "Store at room temperature for a week, or refrigerate for longer",
      "Grapes (Green/Black/Red)": "Store unwashed in perforated bag in back of fridge",
      "Strawberry": "Store unwashed in single layer in fridge. Wash before eating",
      "Watermelon": "Store whole at room temperature. Cut pieces in airtight container in fridge",
      "Papaya": "Ripen at room temperature, refrigerate when ripe",
      "Pineapple": "Store upside down at room temperature to distribute sugars",
      "Avocado": "Ripen at room temperature. Refrigerate only when ripe",
      "Pomegranate": "Store whole at room temperature or refrigerate for longer storage",
      "Lemon": "Store at room temperature for a week, or refrigerate for 3+ weeks",

      // Dairy
      "Milk": "Store in coldest part of fridge, not in door. Keep sealed",
      "Curd (Yogurt)": "Store in fridge. Keep container sealed",
      "Paneer": "Store in water in fridge, change water daily",
      "Cheese": "Wrap in wax paper then plastic wrap. Store in warmest part of fridge",
      "Butter": "Store covered in fridge or freezer for longer storage",
      "Eggs": "Store in original carton in fridge, not in door",

      // Meat
      "Chicken": "Store in coldest part of fridge. Use within 2 days or freeze",
      "Fish": "Store on ice in fridge. Use within 1-2 days or freeze immediately",

      // Grains
      "Rice": "Store in airtight container in cool, dry place",
      "Bread": "Store at room temperature in original packaging. Freeze for longer storage"
    };
    return tips[name] || "Store in a cool, dry place. Check regularly for freshness.";
  }

  function getDaysUntilExpiry(expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  }

  function getExpiryStatus(expiryDate) {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    if (daysLeft < 0) {
      return { status: 'expired', message: 'This item has expired!', daysLeft };
    } else if (daysLeft === 0) {
      return { status: 'expires-today', message: 'This item expires today!', daysLeft };
    } else if (daysLeft <= 2) {
      return { status: 'critical', message: `Expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}! Use immediately.`, daysLeft };
    } else if (daysLeft <= 5) {
      return { status: 'warning', message: `Expires in ${daysLeft} days. Plan to use soon.`, daysLeft };
    } else {
      return { status: 'fresh', message: `${daysLeft} days until expiry.`, daysLeft };
    }
  }
  
  module.exports = { estimateExpiry, getStorageTip, getDaysUntilExpiry, getExpiryStatus };