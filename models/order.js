const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  cart: [
    {
      id: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
      img1: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },
      value: { type: Number, required: true },
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
