const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
const ErrorMiddleware = require("./middleware/error");
const path=require("path")
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173", "s81-mohammed-capstone-food-waste-re-eight.vercel.app"],
  credentials: true
}));


const userRouter = require('./controllers/userRoutes');
const groceryRouter = require("./controllers/groceryRoutes");
const profileRouter = require("./controllers/profileRoutes");

app.get("/test", async (req, res) => {
  res.send("hello.....");
});

app.use('/profile-photo', express.static(path.join(__dirname, 'upload')));


app.use("/user", userRouter);
app.use("/grocery", groceryRouter);
app.use("/profile", profileRouter);

app.use(ErrorMiddleware);

module.exports = { app };
