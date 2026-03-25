const Notification = require("../../models/notification");

module.exports = {
  createNotification: async (userId, type, message) => {
    try {
      const notif = await Notification.create({
        userId,
        type,
        message,
        isRead: false,
      });
      return notif;
    } catch (err) {
      console.error("Notification creation error:", err);
    }
  },

  getNotification: async (req, res) => {
    try {
      const notifications = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5);

      res.status(200).json({ success: true, body: notifications });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  markRead: async (req, res) => {
    try {
      await Notification.updateMany(
        { userId: req.user._id, isRead: false },
        { $set: { isRead: true } }
      );
      res
        .status(200)
        .json({ success: true, message: "All notifications marked as read" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
