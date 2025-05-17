// const { app } = require("./app");
// require("dotenv").config();
// const connection = require("./db/connection");

// const userRoute = require('./controllers/userRoutes');


// app.get("/test", async (req, res) => {
//   res.send("hello......");
// });

// const port = process.env.PORT || 2806;
// app.listen(port, async () => {
//   try {
//     await connection;
//     console.log(`App is running on http://localhost:${port}`);
//   } catch (error) {
//     console.log(error);
//   }
// });







const { app } = require("./app");
require("dotenv").config();
const connection = require("./db/connections");

// const userRouter = require('./controllers/userRoutes');

// Start server
const port = process.env.PORT || 2806;

app.listen(port, async () => {
  try {
    await connection;
    // console.log(` Connected to MongoDB`);
    console.log(`Server is running at http://localhost:${port}`);
  } catch (error) {
    console.error(" Failed to connect to MongoDB:", error);
  }
});
