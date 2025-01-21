// notification reoute

const express = require("express");

const router = express.Router();
router.get("/", (req, res) => {
  // Get io
  const io = req.app.get("io");
  io.emit("message", "Notification Route");
  res.send("Notification Route");
});

module.exports = router;
