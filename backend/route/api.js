const express = require("express");
const router = express.Router();
const authController = require("../controllers/api/authController");
const categoriesController = require("../controllers/api/categoriesController");
const subCategoriesController = require("../controllers/api/subCategoriesController");
const productController = require("../controllers/api/productController");
const orderController = require("../controllers/api/orderController");
const authMiddleware = require("../middleware/auth");
const dashboardController = require("../controllers/api/dashboardController");
const notificationController = require("../controllers/api/notificationController");
const cmsController = require("../controllers/api/cmsController");
//adminDashboard
router.get(
  "/adminDashboard",
  authMiddleware.VerifyToken,
  dashboardController.adminDashboard,
);

//notification
router.post(
  "/createNotification",
  authMiddleware.VerifyToken,
  notificationController.createNotification,
);
router.get(
  "/getNotification",
  authMiddleware.VerifyToken,
  notificationController.getNotification,
);
router.post(
  "/markRead",
  authMiddleware.VerifyToken,
  notificationController.markRead,
);

// user routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authMiddleware.VerifyToken, authController.logout);
router.post(
  "/adminUpdateProfile",
  authMiddleware.VerifyToken,
  authController.adminUpdateProfile,
);
router.get(
  "/adminGetProfile",
  authMiddleware.VerifyToken,
  authController.adminGetProfile,
);

//user routes
router.get("/userList", authController.userList);
router.post("/addUser", authMiddleware.VerifyToken, authController.addUser);
router.post("/editUser", authController.editUser);
router.post("/deleteUser", authController.deleteUser);
router.get("/viewUser/:_id", authController.viewUser);
router.post("/toggleStatusUser", authController.toggleStatusUser);

//category routes
router.post("/addCategory", categoriesController.addCategory);
router.post("/updateCategory", categoriesController.updateCategory);
router.post("/deleteCategory", categoriesController.deleteCategory);
router.get("/getAllCategory", categoriesController.getAllCategory);
router.post("/viewCategory", categoriesController.viewCategory);
router.post("/toggleStatus", categoriesController.toggleStatus);

//subCategory
router.post("/addSubCategory", subCategoriesController.addSubCategory);
router.post("/updateSubCategory", subCategoriesController.updateSubCategory);
router.post("/deleteSubCategory", subCategoriesController.deleteSubCategory);
router.get("/getAllSubCategory", subCategoriesController.getAllSubCategory);
router.post("/viewSubCategory", subCategoriesController.viewSubCategory);
router.post(
  "/toggleStatusSubCategory",
  subCategoriesController.toggleStatusSubCategory,
);

//product routes
router.post("/addProduct", productController.addProduct);
router.post("/editProduct", productController.editProduct);
router.post("/deleteProduct", productController.deleteProduct);
router.get("/viewProduct/:_id", productController.viewProduct);
router.get("/getAllProduct", productController.getAllProduct);
router.post("/toggleStatusProduct", productController.toggleStatusProduct);

//orders routes

router.post("/addOrder", orderController.addOrder);
router.get("/getAllOrders", orderController.getAllOrders);
router.post("/getOrderById", orderController.getOrderById);
router.post("/getUserOrders", orderController.getUserOrders);
router.post("/updateOrderStatus", orderController.updateOrderStatus);
router.delete("/deleteOrder", orderController.deleteOrder);

//cms routes

router.post(
  "/getByType",
  authMiddleware.VerifyToken,
  cmsController.getCmsByType,
);
router.post("/about-us", authMiddleware.VerifyToken, cmsController.AboutUs);
router.post(
  "/privacy-policy",
  authMiddleware.VerifyToken,
  cmsController.PrivacyPolicy,
);
router.post(
  "/terms-condition",
  authMiddleware.VerifyToken,
  cmsController.TermsCondition,
);
module.exports = router;
