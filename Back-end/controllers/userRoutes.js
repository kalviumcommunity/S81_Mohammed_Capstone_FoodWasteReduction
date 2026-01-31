          const express = require("express");
            const { UserModel } = require("../model/userModel");
            const Errorhandler = require("../utils/errorhadler");
            const bcrypt = require("bcrypt");
            const jwt = require("jsonwebtoken");
            const catchAsyncError = require("../middleware/catchAsyncError");
            const upload = require("../middleware/multer");
            const userRouter = express.Router();
            require("dotenv").config();

            const requireAuth = (req, res, next) => {
              const token = req.cookies?.accesstoken;
              if (!token) return res.status(401).json({ message: "Unauthorized" });
              try {
                const decoded = jwt.verify(token, process.env.SECRET);
                req.userId = decoded.id;
                return next();
              } catch (error) {
                return res.status(401).json({ message: "Unauthorized" });
              }
            };

            // userRouter.get("/signup", (req, res) => {
            //   res.status(200).send("Signup Page");
            // });  

            userRouter.post("/signup",
              catchAsyncError(async (req, res, next) => {
                const { name, email, password } = req.body;

                if (!email || !name || !password) {
                  return next(new Errorhandler("All fields are required", 400));
                }

                if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
                  return next(new Errorhandler("Invalid email format", 400));
                }

              
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
                  // httpOnly: true,
                  maxAge: 30 * 24 * 60 * 60 * 1000,
                });

                res.status(200).json({ success: true, message: "Login successful" });
              })
            );

            userRouter.get("/checklogin", requireAuth, async (req, res) => {
              try {
                const user = await UserModel.findById(req.userId).select("-password");
                if (!user) return res.status(404).json({ message: "User not found" });
                res.json({ message: user });
              } catch (err) {
                res.status(500).json({ message: "Error fetching user", error: err.message });
              }
            });

            userRouter.post("/upload", requireAuth, upload.single("photo"), async (req, res) => {
              try {
                if (!req.file) {
                  return res.status(400).json({ message: "No file uploaded" });
                }

                const user = await UserModel.findByIdAndUpdate(
                  req.userId,
                  { profilePhoto: req.file.filename },
                  { new: true }
                ).select("-password");

                return res.status(200).json({ message: { profilePhoto: user.profilePhoto } });
              } catch (err) {
                res.status(500).json({ message: "Upload failed", error: err.message });
              }
            });

// zwrexdtcfhvjbknlmnjkbhjvgcfxtdzr
          

            userRouter.put("/forgot-password", async (req, res) => {

            const { email, newPassword } = req.body;
            try {
            if (!email || !newPassword) {
            return res.status(400).json({ message: "Missing fields" });
            }
            const user = await UserModel.findOne({ email });
            if (!user) {
            return res.status(404).json({ message: "User not found" });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();


            res.json({ message: "Password reset successful." });


            } catch (err) {
            console.error("Forgot password error:", err);
            res.status(500).json({ message: "Server error" });
            }
            });

          module.exports=userRouter








