const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const User = require("./models/userModel");
app.use(cookieParser());
app.use(express.json({ extended: false }));

// Enable CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

//Importing Routes
const UserRoutes = require("./routes/userRoutes");
const CategoryRoutes = require("./routes/categoryRoutes");
const ProductRoutes = require("./routes/productRoutes");
const OrderRoutes = require("./routes/orderRoute");
const ReviewRoutes = require("./routes/reviewRoute");
const NotificationRoutes = require("./routes/notificationRoute");

// Routes
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/category", CategoryRoutes);
app.use("/api/v1/product", ProductRoutes);
app.use("/api/v1/order", OrderRoutes);
app.use("/api/v1/review", ReviewRoutes);
app.use("/api/v1/notification", NotificationRoutes);

// Importing Middleware
const errorMiddleware = require("./middlewares/error");
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Server is running");
});
// // Serve static files from the React app's build directory
// app.use(express.static(path.join(__dirname, "../client/dist")));

// // Handle all other routes by sending the main index.html file
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
// });

module.exports = app;
