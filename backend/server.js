const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path"); // Import the path module

dotenv.config();

// Connect to the database
connectDB();

// Initialize app
const app = express();
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API IS RUNNING");
});

app.use("/api/user", userRoutes);
app.use(notFound);
app.use(errorHandler);

//-------------------DEPLOYMENT------------/////
const __dirname1 = path.resolve(); // Ensure __dirname1 is defined
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}
//-------------------DEPLOYMENT------------/////

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  if (singleChat) {
    res.send(singleChat);
  } else {
    res.status(404).send({ message: "Chat not found" });
  }
});

// Create an HTTP server
const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Change to your frontend's URL
    methods: ["GET", "POST"],
  },
});

// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 6000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.yellow.bold);
});
