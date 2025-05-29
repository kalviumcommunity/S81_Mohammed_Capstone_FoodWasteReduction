const express = require('express');
const groceryRouter = express.Router();
const GroceryModel = require('../model/groceryModel');
const { estimateExpiry, getStorageTip } = require('../utils/expiryHelper');
// const calculateExpiry = require('../utils/calculateExpiry');

// Add a grocery item
groceryRouter.post('/add', async (req, res) => {
  const { user, name, quantity, purchaseDate } = req.body;

  try {
    const estimatedExpiry = estimateExpiry(name, purchaseDate);
    const storageTip = getStorageTip(name);

    const item = new GroceryModel({
      user: user,
      name: name,
      quantity,
      purchaseDate,
      expiryDate: estimatedExpiry,
      storageTips: storageTip,
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

 module.exports = groceryRouter;
