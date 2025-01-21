const dotenv = require("dotenv");
dotenv.config({ path: "server/config.env" });
const app = require("./app");
const connectDatabase = require("./Config/database");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const http = require("http");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { server } = require("./Config/socket");
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});
// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(mongoSanitize());

app.use(limiter);

// Connecting to database
connectDatabase();

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});
// Handling SIGTERM signal
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down the server");
  server.close(() => {
    console.log("Process terminated");
  });
});
