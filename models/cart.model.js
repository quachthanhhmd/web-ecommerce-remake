const mongoose = require("mongoose");

const enumStatus = {
  values: ['waiting', 'checked', 'paid']
};

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: enumStatus,
    default: "waiting",
  },
  items: {
    type: Array,
    default: [],
  },
  
  totalQuantity: {
    type: Number,
    default: 0,
  },
  totalCost: {
    type: String,
    default: 0,
  },
  
});

// Add plugins
cartSchema.set("timestamps", true);

module.exports = mongoose.model("Cart", cartSchema);
