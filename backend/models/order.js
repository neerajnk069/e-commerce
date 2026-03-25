const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    address: {
      fullName: { type: String },
      phone: { type: String },
      house: { type: String },
      city: { type: String },
      pincode: { type: String },
      state: { type: String },
    },
    paymentMethod: { type: String, enum: ["COD", "ONLINE"], default: "COD" }, // 0 for COD, 1 for Online
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"], // 0 for pending , 1 for paid
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], // 0 for pending, 1 for processing,2 for shipped,3 for Delivered,4 for Cancelled
      default: "Pending",
    },
    trackingId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
