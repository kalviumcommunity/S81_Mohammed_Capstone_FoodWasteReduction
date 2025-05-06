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

