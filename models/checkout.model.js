const mongoose = require("mongoose");

const enumStatus = {
  values: ['waiting', 'confirmed', 'transferring', 'delivered', 'canceled'],
};

const enumPaymentMethod = {
  values: ["cod", "paypal", "banking"],
};

const checkoutSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  cartId: {
    type: mongoose.Types.ObjectId,
    ref: "Cart",
  },
  status: {
    type: String,
    enum: enumStatus,
    default: "waiting",
  },
  receiver: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  paymentMethod: {
    type: String,
    enum: enumPaymentMethod,
    default: "cod",
  },
  items: {
    type: Array,
    default: [],
  },
  // {itemId, name, price, quantity}
  totalQuantity: {
    type: Number,
    default: 0,
  },
  totalCost: {
    type: String,
    default: 0,
  },
  shippingFee: {
    type: Number,
    default: 3,
  },
  totalPayment: {
    type: String,
    required: [true, "Total payment is required!"],
  },
  date: {
		type: Date,
		default: new Date(),
  }
});

// Add plugins
checkoutSchema.set("timestamps", true);

module.exports = mongoose.model("Checkout", checkoutSchema);