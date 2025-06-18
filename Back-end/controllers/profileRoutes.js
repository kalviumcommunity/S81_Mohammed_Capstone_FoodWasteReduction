// const express = require('express');
// const profileRouter = express.Router();
// const userModel = require('../model/userModel');

// // Get profile by userId
// profileRouter.get('/:userId', async (req, res) => {
//   try {
//     const user = await UserModel.findById(req.params.userId).select('-password');
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching user profile", error: err.message });
//   }
// });

// module.exports = profileRouter;


const express = require("express");
const profileRouter = express.Router();
const { UserModel } = require("../model/userModel");

// Check login and get user data
profileRouter.get("/checklogin", async (req, res) => {
  try {
    const userId = req.user?.id; // Use your auth middleware to attach `req.user`
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await UserModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

module.exports = profileRouter;