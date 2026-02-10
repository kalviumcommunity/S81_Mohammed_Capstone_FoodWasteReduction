const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  grocery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "grocery",
  },
  type: {
    type: String,
    enum: ["expiry-warning", "expiry-critical", "expired"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
});

const NotificationModel = mongoose.model("notification", notificationSchema);
module.exports = NotificationModel;
