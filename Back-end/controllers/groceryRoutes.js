const express = require('express');
  const groceryRouter = express.Router();
  const GroceryModel = require('../model/groceryModel');
  const expiryHelper = require('../utils/expiryHelper').default;
  const estimateExpiry = expiryHelper.estimateExpiry;
  const getStorageTip = expiryHelper.getStorageTip;

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
 
groceryRouter.get('/user/:userId', async (req, res) => {
  try {
   const items = await GroceryModel.find({ user: req.params.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching groceries', error: err.message });
  }
});

  
  // Update grocery item by ID
  // groceryRouter.put('/update/:id', async (req, res) => {
  //   try {
  //     const { name, quantity, purchaseDate } = req.body;
  //     const updated = await GroceryModel.findByIdAndUpdate(
  //       req.params.id,
  //       { name: name, quantity, purchaseDate },
  //       { new: true }
  //     );

  //     if (!updated) return res.status(404).json({ error: 'Item not found' });

  //     res.status(200).json({ message: 'Item updated successfully', grocery: updated });
  //   } catch (err) {
  //     res.status(500).json({ error: 'Failed to update grocery item' });
  //   }
  // });

  groceryRouter.put('/update/:id', async (req, res) => {
  try {
    const { name, quantity, purchaseDate } = req.body;

    const estimatedExpiry = estimateExpiry(name, purchaseDate);
    const storageTip = getStorageTip(name);

    const updated = await GroceryModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        quantity,
        purchaseDate,
        expiryDate: estimatedExpiry,
        storageTips: storageTip
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Item not found' });

    res.status(200).json({ message: 'Item updated successfully', grocery: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update grocery item' });
  }
});


// Delete grocery item by ID
groceryRouter.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await GroceryModel.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: 'Item not found' });

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete grocery item' });
  }
});

module.exports = groceryRouter;
