require("dotenv").config();
const User = require("../../models/users");
const { Validator } = require("node-input-validator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const secretkey = process.env.SECRET_KEY;
const { fileUpload } = require("../../helper/helper");
const notificationController = require("../api/notificationController");
const { getIO } = require("../../socket");

module.exports = {
  signup: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        name: "required",
        email: "required|email",
        phoneNumber: "required|numeric|minLength:10",
        countryCode: "required",
        password: "required|minLength:8",
        confirmPassword: "required|minLength:8",
        // role: "required", // 0 admin ,1 user
      });

      const match = await validator.check();
      if (!match) {
        return res.status(422).json({
          success: false,
          statusCode: 422,
          message: "Validation failed",
          errors: validator.errors,
        });
      }

      const {
        name,
        email,
        phoneNumber,
        countryCode,
        password,
        confirmPassword,
      } = req.body;

      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message:
            existingUser.email === req.body.email
              ? "Email already registered"
              : "Phone number already registered",
        });
      }
      if (password !== confirmPassword) {
        return res
          .status(402)
          .json({ message: "confirm password is not correct" });
      }

      let role = 1;

      const adminExist = await User.findOne({ role: 0 });
      if (!adminExist && req.body.role == 0) {
        role = 0;
      }

      let imagePath = "";
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
        const uploadPath = "uploads/" + Date.now() + "-" + imageFile.name;
        await imageFile.mv(uploadPath);
        imagePath = "public/uploads" + uploadPath;
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        phoneNumber,
        countryCode,
        image: imagePath,
        password: hashPassword,
        role,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          countryCode: newUser.address,
          image: newUser.image,
          role: newUser.role,
        },
        token,
        body: newUser,
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        email: "required|email",
        password: "required|minLength:8",
      });

      const matched = await validator.check();

      if (!matched) {
        return res
          .status(422)
          .json({ success: false, StatusCode: 422, errors: validator.errors });
      }

      const { email, password } = req.body;

      let existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(401).json({
          success: true,
          statusCode: 401,
          message: "Email not registered ",
          errors: validator.errors,
        });
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "MissMatch  password" });
      }

      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      await User.updateOne(
        { _id: existingUser._id },
        {
          verifyStatus: 0,
          otp: otp,
          loginAt: new Date(),
          logoutAt: null,
        },
      );

      let get_data = await User.findOne({ email });
      let token = jwt.sign(
        {
          _id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
          loginAt: new Date(),
        },
        secretkey,
        { expiresIn: "7d" },
      );

      get_data = get_data.toObject();
      get_data.token = token;
      delete get_data.password;
      delete get_data.otp;
      get_data.role = existingUser.role;

      res.status(200).json({
        success: true,
        code: 200,
        message: " login Successfully",
        body: get_data,
      });
    } catch (error) {
      console.log("  login error ", error);
      res.status(500).json({
        success: false,
        StatusCode: 500,
        message: "Something went wrong",
        body: error.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
      const userId = req.user._id;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          token: null,
          logoutAt: new Date(),
        },
        { new: true },
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Logout successful",
        logoutAt: updatedUser.logoutAt,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  },

  userList: async (req, res) => {
    try {
      const users = await User.find({ role: 1 });
      const formattedUsers = users.map((user) => ({
        _id: user._id,
        image: user.image || null,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        role: user.role,
        status: user.status,
      }));
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User list fetched successfully",
        body: formattedUsers,
      });
    } catch (error) {
      console.error("userList API Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  },

  addUser: async (req, res) => {
    try {
      req.body.role = 1;

      const { name, email, phoneNumber, status } = req.body;

      const emailExist = await User.findOne({ email });
      if (emailExist) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      const imagePath = await fileUpload(req.files.image, "/images");

      const user = new User({
        image: imagePath,
        name,
        email,
        phoneNumber,
        role: 1,
        status: 1,
      });

      await user.save();

      const addUser = await User.findById(user._id);
      getIO().emit("productAdded", addUser);

      await notificationController.createNotification(
        req.user.id,
        "user",
        `New user added: ${name}`,
      );

      res.status(201).json({
        success: true,
        message: "User added successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  editUser: async (req, res) => {
    try {
      const { id } = req.body;
      const update = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (req.files && req.files.image) {
        const imagePath = await fileUpload(req.files.image, "/images");
        update.image = imagePath;
      }

      const fieldsToUpdate = [
        "name",
        "email",
        "phoneNumber",
        "image",
        "status",
      ];
      fieldsToUpdate.forEach((field) => {
        if (req.body[field] !== undefined && req.body[field] !== "") {
          user[field] = req.body[field];
        }
      });
      await user.save();

      const userEdit = await User.findById(user._id);
      getIO().to("Admin_Room").emit("userEdited", userEdit);
      getIO().to("User_Room").emit("userEdited", userEdit);
      console.log(getIO());

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: userEdit,
      });
    } catch (error) {
      console.log("Edit User Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.body;

      console.log("ID Received:", id);

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.image) {
        const fileName = path.basename(user.image);
        const imagePath = path.join(__dirname, "public/images", fileName);

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await User.deleteOne({ _id: id });

      getIO().emit("userDeleted", {
        userId: id,
      });

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.log("Delete User Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
  viewUser: async (req, res) => {
    try {
      const { _id } = req.params;

      if (!_id) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const user = await User.findById(_id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        body: user,
      });
    } catch (error) {
      console.log("View User Error:", error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
  toggleStatusUser: async (req, res) => {
    try {
      const { id, status } = req.body;
      const user = await User.findById(id);
      if (!user) return res.json({ success: false });

      user.status = status;
      await user.save();

      const io = getIO();
      io.to("Admin_Room").emit("userStatusUpdate", {
        userId: user._id,
        status: user.status,
      });
      console.log("SOCKET EMITTED:", user._id, user.status);

      res.json({ success: true, message: "User status updated", user });
    } catch (err) {
      console.error(err);
      res.json({ success: false });
    }
  },
  adminGetProfile: async (req, res) => {
    try {
      if (req.user.role !== 0) {
        return res.status(403).json({
          success: false,
          message: "Only admin can access this API",
        });
      }

      res.status(200).json({
        success: true,
        message: "Admin Profile Found",
        body: req.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  adminUpdateProfile: async (req, res) => {
    try {
      if (req.user.role !== 0) {
        return res.status(403).json({
          success: false,
          message: "Only admin can update profile",
        });
      }

      const user = req.user;

      if (req.files && req.files.image) {
        const imagePath = await fileUpload(req.files.image, "/images");
        user.image = imagePath;
      }

      const allowedFields = ["name", "email", "phoneNumber"];
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      await user.save();

      res.status(200).json({
        success: true,
        message: "Admin Profile Updated Successfully",
        body: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};
