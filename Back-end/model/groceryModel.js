const mongoose = require("mongoose");

const grocerySchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    storageTips: {
      type: String,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    
  });
  

  
  GroceryModel = mongoose.model("grocery", grocerySchema);
  module.exports= GroceryModel






   