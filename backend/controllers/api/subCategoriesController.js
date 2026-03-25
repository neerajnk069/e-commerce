const categories = require("../../models/categories");
const subCategories = require("../../models/subCategories");
const { Validator } = require("node-input-validator");

module.exports = {
  getAllSubCategory: async (req, res) => {
    try {
      const data = await subCategories
        .find()
        .populate("categoryId", "name")
        .sort({ _id: -1 });

      return res.json({
        success: true,
        message: "SubCategories fetched successfully",
        body: data,
      });
    } catch (error) {
      console.log("getAllSubCategory Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  addSubCategory: async (req, res) => {
    try {
      const { categoryId, subcategoryname, status } = req.body;

      if (!categoryId || !subcategoryname) {
        return res.status(400).json({
          success: false,
          message: "Category ID and SubCategory name is required",
        });
      }

      const newSubCategory = new subCategories({
        categoryId,
        subcategoryname,
        status: status ?? 1,
      });

      await newSubCategory.save();

      return res.json({
        success: true,
        message: "SubCategory added successfully",
        body: newSubCategory,
      });
    } catch (error) {
      console.log("addSubCategory Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  updateSubCategory: async (req, res) => {
    try {
      const { id, subcategoryname, status } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "SubCategory ID is required",
        });
      }

      const updated = await subCategories.findByIdAndUpdate(
        id,
        { subcategoryname, status },
        { new: true }
      );

      if (!updated) {
        return res.json({
          success: false,
          message: "SubCategory not found",
        });
      }

      return res.json({
        success: true,
        message: "SubCategory updated successfully",
        body: updated,
      });
    } catch (error) {
      console.log("updateSubCategory Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  deleteSubCategory: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "SubCategory ID is required",
        });
      }

      const deleted = await subCategories.findByIdAndDelete(id);

      if (!deleted) {
        return res.json({
          success: false,
          message: "SubCategory not found",
        });
      }

      return res.json({
        success: true,
        message: "SubCategory deleted successfully",
      });
    } catch (error) {
      console.log("deleteSubCategory Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  viewSubCategory: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "SubCategory ID is required",
        });
      }

      const subCat = await subCategories
        .findById(id)
        .populate("categoryId", "name");

      if (!subCat) {
        return res.json({
          success: false,
          message: "SubCategory not found",
        });
      }

      return res.json({
        success: true,
        message: "SubCategory fetched successfully",
        body: subCat,
      });
    } catch (error) {
      console.log("viewSubCategory Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  toggleStatusSubCategory: async (req, res) => {
    try {
      const subCategory = await subCategories.findById({ _id: req.body.id });
      if (!subCategory) return res.json({ success: false });

      await subCategories.findByIdAndUpdate(req.body.id, {
        status: req.body.status,
      });

      res.json({ success: true, status: 1 });
    } catch (err) {
      console.error(err);
      res.json({ success: false });
    }
  },
};
