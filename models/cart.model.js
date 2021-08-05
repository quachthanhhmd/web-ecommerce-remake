const mongoose = require("mongoose");

const enumStatus = {
  values: ['waiting', 'checked', 'paid']
};


const userSchema = mongoose.Schema({

  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },

});


const cartSchema = mongoose.Schema({
  userId: {
    type: Array,
    default: [mongoose.Types.ObjectId]
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

  payment: {
    type: String,
    default: 0,
  },
  promotionCode: {
    type: String,
    default: ""
  },
  discountPrice: {
    type: String,
    default: ""
  },
  discountRate: {
    type: Number,
    default: 0,
  }

});

// Add plugins
cartSchema.set("timestamps", true);

module.exports = mongoose.model("Cart", cartSchema);


module.exports.initCart = {
  userId: [],
  status: "waiting",
  items: [],
  totalQuantity: 0,
  totalCost: 0,
};
