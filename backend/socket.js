const { Server } = require("socket.io");
const User = require("./models/users");

let io;

module.exports = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("registerUser", async ({ userId, role }) => {
      await User.findByIdAndUpdate(userId, {
        socketId: socket.id,
      });

      if (Number(role) === 0) {
        socket.join("Admin_Room");
      } else {
        socket.join("User_Room");
      }
    });

    socket.on("userStatusUpdate", ({ userId, status }) => {
      console.log("user Status Updated:", userId, status);

      io.emit("userStatusChanged", {
        userId,
        status,
      });
    });

    socket.on("userEdit", ({ updatedUser }) => {
      console.log("userEdited:", updatedUser);
    });

    socket.on("userDelete", ({ userId }) => {
      console.log("productDeleted", userId);
    });

    socket.on("productStatusUpdate", ({ productId, status }) => {
      console.log("Product Status Updated:", productId, status);

      io.emit("productStatusChanged", {
        productId,
        status,
      });
    });

    socket.on("productEdit", ({ updatedProduct }) => {
      console.log("ProductEdited:", updatedProduct);
    });

    socket.on("productDelete", ({ productId }) => {
      console.log("productDeleted", productId);
    });

    socket.on("disconnect", async () => {
      await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
      console.log("Disconnected:", socket.id);
    });
  });
};
module.exports.getIO = () => io;
