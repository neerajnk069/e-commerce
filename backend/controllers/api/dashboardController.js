const Order = require("../../models/order");
const User = require("../../models/users");
const Product = require("../../models/product");

module.exports = {
  adminDashboard: async (req, res) => {
    try {
      if (req.user.role !== 0) {
        return res.status(403).json({
          success: false,
          message: "Only admin can access dashboard",
        });
      }

      const totalUsers = await User.countDocuments({});
      const totalProducts = await Product.countDocuments({});
      const totalOrders = await Order.countDocuments({});

      const pendingOrders = await Order.countDocuments({
        orderStatus: "Pending",
      });
      const deliveredOrders = await Order.countDocuments({
        orderStatus: "Delivered",
      });
      const cancelledOrders = await Order.countDocuments({
        orderStatus: "Cancelled",
      });

      const monthly = await Order.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            orders: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthlySales = months.map((name, index) => {
        const found = monthly.find((m) => m._id === index + 1);
        return {
          month: name,
          orders: found ? found.orders : 0,
          revenue: found ? found.revenue : 0,
        };
      });

      res.status(200).json({
        success: true,
        message: "Dashboard Data Fetched",
        body: {
          totalUsers,
          totalProducts,
          totalOrders,
          pendingOrders,
          deliveredOrders,
          cancelledOrders,
          monthlySales,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
    }
  },
};
