const { Validator } = require("node-input-validator");
const User = require("../../models/users");
const Order = require("../../models/order");
const Product = require("../../models/product");
const notificationController = require("../api/notificationController");
module.exports = {
  addOrder: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        userId: "required",
        products: "required",
        address: "required",
        paymentMethod: "required",
        orderStatus: "required",
      });

      const matched = await validator.check();
      if (!matched) {
        return res.status(422).json({
          success: false,
          message: "Validation failed",
          errors: validator.errors,
        });
      }

      let { userId, products, address, paymentMethod, orderStatus } = req.body;

      let finalAddress = address;

      if (typeof address === "string") {
        try {
          finalAddress = JSON.parse(address);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid address format",
          });
        }
      }

      let parsedProducts =
        typeof products === "string" ? JSON.parse(products) : products;

      if (!parsedProducts.length) {
        return res.status(400).json({
          success: false,
          message: "Products array required",
        });
      }

      let totalAmount = 0;

      for (const item of parsedProducts) {
        const prod = await Product.findById(item.productId);

        if (!prod) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.productId}`,
          });
        }

        totalAmount += item.quantity * item.price;
      }

      const validStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (!validStatuses.includes(orderStatus)) {
        orderStatus = "Pending";
      }

      const finalPaymentStatus =
        paymentMethod === "ONLINE" ? "Paid" : "Pending";

      const trackingId = "TRK" + Date.now();

      const newOrder = new Order({
        userId,
        products: parsedProducts,
        totalAmount,
        address: finalAddress,
        paymentMethod,
        paymentStatus: finalPaymentStatus,
        orderStatus,
        trackingId,
      });

      await newOrder.save();

      await notificationController.createNotification(
        userId,
        newOrder._id,
        "Order",
        `New order placed: Tracking ID ${trackingId}`
      );
      console.log("NOTIFICATION FILE:", notificationController);

      return res.json({
        success: true,
        message: "Order placed successfully",
        order: newOrder,
      });
    } catch (error) {
      console.log("Add Order Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("userId", "name email phone")
        .populate("products.productId", "name price");

      console.log("Orders fetched:", orders);

      return res.json({
        success: true,
        message: "Orders fetched",
        body: orders,
      });
    } catch (error) {
      console.log("GetAllOrders Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  getOrderById: async (req, res) => {
    console.log(req.body.id, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    try {
      const order = await Order.findById(req.body.id)
        .populate("userId", "name email phone")
        .populate("products.productId", "productname price");

      if (!order)
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });

      return res.json({
        success: true,
        body: order,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  getUserOrders: async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.body.userId }).populate(
        "products.productId",
        "productname price"
      );

      return res.json({
        success: true,
        body: orders,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id, orderStatus } = req.body;

      if (!id || !orderStatus)
        return res
          .status(400)
          .json({ success: false, message: "Missing fields" });

      const order = await Order.findById(id);

      if (!order)
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });

      order.orderStatus = orderStatus;
      await order.save();

      return res.json({
        success: true,
        message: "Order status updated",
        body: order,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findOneAndDelete(req.body.id);

      if (!order)
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });

      return res.json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
};
