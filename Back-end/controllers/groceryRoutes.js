const express = require('express');
const groceryRouter = express.Router();
const GroceryModel = require('../model/groceryModel');
const { estimateExpiry, getStorageTip } = require('../utils/expiryHelper');
// const calculateExpiry = require('../utils/calculateExpiry');

// Add a grocery item
groceryRouter.post('/add', async (req, res) => {
  const { userId, itemName, quantity, purchaseDate } = req.body;

  try {
    const estimatedExpiry = estimateExpiry(itemName, purchaseDate);
    const storageTip = getStorageTip(itemName);

    const item = new Grocery({
      userId,
      itemName,
      quantity,
      purchaseDate,
      estimatedExpiry,
      storageTip,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error adding item', error: err.message });
  }
});

// Get grocery items for a user
groceryRouter.get('/:userId', async (req, res) => {
  try {
    const items = await Grocery.find({ userId: req.params.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching groceries', error: err.message });
  }
});


// const calculateExpiry = require('../utils/calculateExpiry');

// router.post('/add', async (req, res) => {
//   const { userId, itemName, quantity, purchaseDate } = req.body;

//   const expiryDate = calculateExpiry(itemName, purchaseDate);

//   const grocery = new Grocery({
//     userId,
//     itemName,
//     quantity,
//     purchaseDate,
//     expiryDate,
//   });

//   await grocery.save();
//   res.status(201).json({ message: 'Grocery item added with expiry', grocery });
// });


 module.exports = groceryRouter;
