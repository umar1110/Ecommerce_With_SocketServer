const { Server } = require("socket.io");
const http = require("http");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = require("../app"); // Assuming your Express app is defined in app.js

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust the origin as needed
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.use((socket, next) => {
  console.log("Socket Middleware");
  cookieParser()(socket.request, socket.request.res, async (err) => {
    if (err) {
      console.log(err.message);
      return next(new Error("Authentication error"));
    }

    try {
      const token = socket.request?.cookies?.token;
      if (!token) {
        console.log("Guest User connected");
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      socket.userId = userId;
      console.log("Authenticated User connected");
    } catch (error) {
      console.log(error.message);
      return next(new Error("Authentication error"));
    }

    next();
  });
});

// Handle socket connections
io.on("connection", (socket) => {
  const userId = socket.userId;
  console.log(userId);
  if (userId) {
    socket.join(`user_${userId}`);
  }

  io.to(`user_${userId}`).emit("message", `Welcome to the chat `);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = {
  io,
  server,
};
