const mongoose = require("mongoose");

const userSchema =  mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  language: {
    type: String,
    default: "English", // Multi-lingual support
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports={UserModel};