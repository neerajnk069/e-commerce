const Cart = require("../../../../../DineSafe/models/cart");
const { Validator } = require("node-input-validator");

module.exports = {
  createCart: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        productId: "required",
        quantity: "required",
        price: "required",
      });

      const matched = await validator.check();
      if (!matched) {
        return res
          .status(422)
          .json({ success: false, statusCode: 422, errors: validator.errors });
      }

      let result = await Cart.create({
        productId: req.body.productId,
        userId: req.user.id,
        quantity: req.body.quantity,
        price: req.body.price,
      });

      if (!result) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: `Something went wrong`,
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `Cart is created successfull`,
        body: result,
      });
    } catch (error) {
      console.log(error, "errror");
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Errror",
      });
    }
  },
  getMyCartList: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        cartId: "required",
      });

      const matched = await validator.check();
      if (!matched) {
        return res
          .status(422)
          .json({ success: false, statusCode: 422, errors: validator.errors });
      }
      const getcart = await Cart.findById({ _id: req.body.cartId });
      if (getcart) {
        return res.status(200).json({
          success: true,
          mesage: " Cart fetch successfully ",
          statusCode: 200,
          body: getcart,
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Cart not found " });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
        statusCode: 500,
        error: error.message,
      });
    }
  },
  editCart: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        cartId: "required",
      });

      const matched = await validator.check();
      if (!matched) {
        return res
          .status(422)
          .json({ success: false, statusCode: 422, errors: validator.errors });
      }

      const cart = await Cart.findOne({ _id: req.body.cartId });
      console.log(cart, ".....................");

      const editcart = await Cart.findByIdAndUpdate(
        { _id: req.body.cartId },
        {
          quantity: req.body.quantity ? req.body.quantity : Cart.quantity,
        },
        { new: true }
      );

      if (!editcart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
          StatusCode: 404,
        });
      }
      return res.status(200).json({
        success: true,
        StatusCode: 200,
        message: " Cart Edit and Update successfull",
        body: editcart,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to update product",
        error: error.message,
      });
    }
  },
  deleteCartItems: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        cartId: "required",
      });

      const matched = await validator.check();
      if (!matched) {
        return res
          .status(422)
          .json({ success: false, statusCode: 422, errors: validator.errors });
      }
      const deleteCart = await Cart.findById({ _id: req.body.cartId });
      if (!deleteCart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
          body: {},
        });
      }
      const destoryCart = await Cart.deleteOne({
        _id: req.body.cartId,
      });
      return res.status(200).json({
        success: true,
        message: "Cart delete successfull",
        data: {},
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server Error ",
        error: error.message,
      });
    }
  },
};
