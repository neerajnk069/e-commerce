const Product = require("../../models/product");
const { Validator } = require("node-input-validator");
const fs = require("fs");
const path = require("path");
const { getIO } = require("../../socket");

module.exports = {
  addProduct: async (req, res) => {
    try {
      const { categoryId, subCategoryId, name, status, variants } = req.body;

      if (
        !variants ||
        !Array.isArray(JSON.parse(variants)) ||
        JSON.parse(variants).length === 0
      ) {
        return res.json({ success: false, message: "Variants are required" });
      }

      let imagePath = "";
      if (!req.files || !req.files.image) {
        return res.json({ success: false, message: "Image is required" });
      }

      if (req.files && req.files.image) {
        let imageFile = req.files.image;
        let uploadPath = "public/images/" + Date.now() + "-" + imageFile.name;
        await imageFile.mv(uploadPath);
        imagePath = "/" + uploadPath;
      }

      const product = await Product.create({
        categoryId,
        subCategoryId,
        name,
        status,
        image: imagePath,
        variants: JSON.parse(variants),
      });

      const populatedProduct = await Product.findById(product._id)
        .populate("categoryId")
        .populate("subCategoryId");
      getIO().emit("productAdded", populatedProduct);

      return res.json({ success: true, message: "Product Added", product });
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: "Server Error" });
    }
  },

  editProduct: async (req, res) => {
    try {
      const { id, variants } = req.body;

      let product = await Product.findById(id);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      let imagePath = product.image;
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
        const uploadPath = "public/images/" + Date.now() + "-" + imageFile.name;

        await imageFile.mv(uploadPath);

        imagePath = "/" + uploadPath.replace("public/", "");
      }
      product.name = req.body.name || product.name;
      product.categoryId = req.body.categoryId || product.categoryId;
      product.subCategoryId = req.body.subCategoryId || product.subCategoryId;

      if (variants) {
        try {
          const parsedVariants = JSON.parse(variants);
          product.variants = parsedVariants;
        } catch (err) {
          return res.json({
            success: false,
            message: "Invalid variants format",
          });
        }
      }
      ((product.image =
        req.files && req.files.image ? imagePath : product.image),
        await product.save());

      const populatedProduct = await Product.findById(product._id)
        .populate("categoryId")
        .populate("subCategoryId");

      getIO().to("Admin_Room").emit("productEdited", populatedProduct);
      getIO().to("User_Room").emit("productEdited", populatedProduct);
      console.log(getIO());

      return res.json({
        success: true,
        message: "Product Updated",
        product: populatedProduct,
      });
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: "Server Error" });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.body;

      const product = await Product.findById(id);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      if (product.image) {
        const fileName = path.basename(product.image);
        const imagePath = path.join(__dirname, "public/images", fileName);

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await Product.deleteOne({ _id: id });

      getIO().emit("productDeleted", {
        productId: req.body.id,
      });

      return res.json({ success: true, message: "Product Deleted" });
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: "Server Error" });
    }
  },
  getAllProduct: async (req, res) => {
    try {
      const body = await Product.find()
        .populate("categoryId", "name")
        .populate("subCategoryId", "subcategoryname");

      body.forEach((p) => {
        if (typeof p.variants === "string") {
          p.variants = JSON.parse(p.variants || "[]");
        }
      });
      return res.json({ success: true, body });
    } catch (error) {
      console.log(error);
      return res.json({ success: false, message: "Server Error" });
    }
  },
  viewProduct: async (req, res) => {
    try {
      const { _id } = req.params;

      if (!_id) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }

      const product = await Product.findById(_id)
        .populate("categoryId")
        .populate("subCategoryId");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const response = {
        _id: product._id,
        name: product.name,
        image: product.image,
        status: product.status,
        category: product.categoryId || {},

        subCategory: product.subCategoryId || {},
        variants:
          product.variants?.map((v) => ({
            _id: v._id,
            color: v.color,
            size: v.size,
            price: v.price,
            quantity: v.quantity,
          })) || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };

      return res.status(200).json({
        success: true,
        product: response,
      });
    } catch (error) {
      console.error("Error viewing product:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },

  toggleStatusProduct: async (req, res) => {
    try {
      const { id, status } = req.body;

      const product = await Product.findById(id);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      product.status = status;
      await product.save();

      const io = getIO();
      io.to("Admin_Room").emit("adminProductStatusUpdate", {
        productId: product._id,
        status: product.status,
      });

      console.log("SOCKET EMITTED:", product._id, product.status);

      res.json({
        success: true,
        message: "Product status updated",
        product,
      });
    } catch (err) {
      console.error(err);
      res.json({ success: false, message: "Server error" });
    }
  },
};
