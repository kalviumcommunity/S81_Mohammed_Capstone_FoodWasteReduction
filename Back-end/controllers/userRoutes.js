const express = require("express");
const { UserModel } = require("../model/userModel");
const Errorhandler = require("../utils/errorhadler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsyncError = require("../middleware/catchAsyncError");
const userRouter = express.Router();
require("dotenv").config();

userRouter.get("/signup", (req, res) => {
  res.status(200).send("Signup Page");
});

userRouter.post("/signup",
  catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      return next(new Errorhandler("All fields are required", 400));
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return next(new Errorhandler("Invalid email format", 400));
    }

    // if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)) {
    //   return next(new Errorhandler("Password must be at least 8 characters long", 400));
    // }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return next(new Errorhandler("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ name, email, password: hashedPassword });

    res.status(201).json({ success: true, message: "Signup successful", user: newUser });
  })
);

userRouter.post("/login",
  catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Errorhandler("Email and password are required", 400));
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(new Errorhandler("Incorrect login details", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new Errorhandler("Incorrect login details", 400));
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "30d" });
    res.cookie("accesstoken", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Login successful" });
  })
);

module.exports=userRouter
