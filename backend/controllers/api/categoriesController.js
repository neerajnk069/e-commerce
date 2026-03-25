const categories = require("../../models/categories");
const { Validator } = require("node-input-validator");

module.exports = {
  getAllCategory: async (req, res) => {
    try {
      const allCategories = await categories.find();
      if (allCategories) {
        return res.status(200).json({
          success: true,
          mesage: "Categories fetch successfully ",
          body: allCategories,
        });
      } else {
        return res.status(403).json({ success: "categories not found " });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  addCategory: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        name: "required|minLength:2",
      });

      const matched = await validator.check();
      if (!matched) {
        return res
          .status(422)
          .json({ success: false, statusCode: 422, errors: validator.errors });
      }

      let { name } = req.body;

      let imagePath = "";
      if (req.files && req.files.image) {
        let imageFile = req.files.image;
        let uploadPath = "public/images/" + Date.now() + "-" + imageFile.name;
        await imageFile.mv(uploadPath);
        imagePath = "/" + uploadPath;
      }

      let allreadyExists = await categories.findOne({ name });
      console.log(allreadyExists, "allreadyExists");

      if (allreadyExists) {
        return res.status(300).json({
          success: true,
          statusCode: 300,
          message: `category name ${name} is all ready Exists`,
        });
      }

      let result = await categories.create({
        name: name,
        status: true,
        image: imagePath,
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
        message: `category name ${name} is created successfull`,
      });
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id, name, status } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Category ID is required!",
        });
      }

      const category = await categories.findById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found!",
        });
      }

      // if (name && name === category.name) {
      //   return res.status(300).json({
      //     success: true,
      //     message: `Category name "${name}" already exists!`,
      //   });
      // }

      let imagePath = category.image;
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
        const uploadPath = "public/images/" + Date.now() + "-" + imageFile.name;

        await imageFile.mv(uploadPath);

        imagePath = "/" + uploadPath.replace("public/", "");
      }

      const updatedCategory = await categories.findByIdAndUpdate(
        id,
        {
          name: name || category.name,
          status: status ?? category.status,
          image: req.files && req.files.image ? imagePath : category.image,
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Category updated successfully!",
        data: updatedCategory,
      });
    } catch (error) {
      console.log(" Error in updateCategory:", error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await categories.findById({ _id: req.body.id });
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "categories not found",
          errors: errors.message,
        });
      }
      const destoryCategory = await categories.deleteOne({
        _id: req.body.id,
      });
      return res.status(200).json({
        success: true,
        message: "category delete successfull",
        data: destoryCategory,
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

  viewCategory: async (req, res) => {
    try {
      const { id } = req.body;

      console.log("User ID received:", id);

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Category ID is required",
        });
      }

      const category = await categories.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Category details fetched successfully",
        body: category,
      });
    } catch (error) {
      console.log("View User Error:", error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
  toggleStatus: async (req, res) => {
    try {
      console.log(req.body, ">>>>>>>>i ma here in controller");

      const category = await categories.findById({ _id: req.body.id });
      console.log(category, ">>>>>>>>cat");
      if (!category) return res.json({ success: false });

      await categories.findByIdAndUpdate(req.body.id, {
        status: req.body.status,
      });

      res.json({ success: true, status: 1 });
    } catch (err) {
      console.error(err);
      res.json({ success: false });
    }
  },
};
