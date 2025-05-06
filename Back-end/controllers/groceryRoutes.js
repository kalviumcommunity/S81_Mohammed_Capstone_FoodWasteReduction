const express = require('express');
const groceryRouter = express.Router();
const GroceryModel = require('../model/groceryModel');
const { estimateExpiry, getStorageTip } = require('../utils/expiryHelper');



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
