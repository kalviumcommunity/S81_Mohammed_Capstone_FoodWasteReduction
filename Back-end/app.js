const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
const ErrorMiddleware = require("./middleware/error");
const path=require("path")
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Dynamic CORS for production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:2806",
  "https://pantrychef-syste.netlify.app",
  "https://s81-mohammed-capstone-foodwastereduction5.onrender.com",
  process.env.FRONTEND_URL // Set this in Railway env vars
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Check if origin is allowed or matches Vercel preview URLs
    if (allowedOrigins.includes(origin) || 
        origin.endsWith('.vercel.app') || 
        origin.endsWith('.railway.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


const userRouter = require('./controllers/userRoutes');
const groceryRouter = require("./controllers/groceryRoutes");
const profileRouter = require("./controllers/profileRoutes");
const { notificationRouter } = require("./controllers/notificationRoutes");

// Root route for health check
app.get("/", (req, res) => {
  res.send("PantryChef API is running successfully");
});

app.get("/test", async (req, res) => {
  res.send("hello.....");
});

app.use('/profile-photo', express.static(path.join(__dirname, 'upload')));


app.use("/user", userRouter);
app.use("/grocery", groceryRouter);
app.use("/profile", profileRouter);
app.use("/notification", notificationRouter);

app.use(ErrorMiddleware);

module.exports = { app };
