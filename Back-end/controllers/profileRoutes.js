  const express = require('express');
  const profileRouter = express.Router();
  const userModel = require('../model/userModel');

  // Get profile by userId
  profileRouter.get('/:userId', async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.userId).select('-password');
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Error fetching user profile", error: err.message });
    }
  });

  module.exports = profileRouter;
