import { useEffect } from "react";
import socket from "./socket";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Login from "./pages/front/Login";
import Register from "./pages/front/Register";
import Cart from "././pages/front/Cart";
import Contact from "././pages/front/Contact";
import Checkout from "././pages/front/Checkout";
import ProfileDetails from "././pages/front/ProductDetails";
import ProfileEdit from "./pages/admin/dashboard/ProfileEdit";
import Order from "./pages/admin/order/Order";
import OrderView from "./pages/admin/order/OrderView";
import Product from "./pages/admin/product/Product";
import AddProduct from "./pages/admin/product/AddProduct";
import EditProduct from "./pages/admin/product/EditProduct";
import ViewProduct from "./pages/admin/product/ViewProduct";
import Category from "./pages/admin/category/Category";
import EditCategory from "./pages/admin/category/EditCategory";
import SubCategory from "./pages/admin/subCategory/SubCategory";
import AddSubCategory from "./pages/admin/subCategory/AddSubCategory";
import EditSubCategory from "./pages/admin/subCategory/EditSubCategory";
import User from "./pages/admin/user/User";
import AddUser from "./pages/admin/user/AddUser";
import EditUser from "./pages/admin/user/EditUser";
import AddCategory from "./pages/admin/category/AddCategory";
import ViewUser from "./pages/admin/user/ViewUser";
import ViewCategory from "./pages/admin/category/ViewCategory";
import ViewSubCategory from "./pages/admin/subCategory/ViewSubCategory";
import AdminProfile from "./pages/front/AdminProfile";
import AboutUs from "./pages/front/AboutUs";
import PrivacyPolicy from "./pages/front/PrivacyPolicy";
import TermsCondition from "./pages/front/TermsCondition";
function App() {
  const tokenFromLogin = localStorage.getItem("token");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user._id) {
      socket.emit("registerUser", {
        userId: user._id,
        role: user.role,
      });

      console.log("User registered on socket");
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-condition" element={<TermsCondition />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profileDetails" element={<ProfileDetails />} />
          <Route
            path="/profile"
            element={<AdminProfile token={tokenFromLogin} />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/category" element={<Category />} />
          <Route
            path="/profileEdit"
            element={<ProfileEdit token={tokenFromLogin} />}
          />

          <Route path="/order" element={<Order />} />
          <Route path="/orderView" element={<OrderView />} />

          <Route path="/product" element={<Product />} />
          <Route path="/product/add" element={<AddProduct />} />
          <Route path="/product/edit" element={<EditProduct />} />
          <Route path="/product/view" element={<ViewProduct />} />

          <Route path="/category" element={<Category />} />
          <Route path="/category/addCategory" element={<AddCategory />} />
          <Route path="/category/editCategory" element={<EditCategory />} />
          <Route path="/category/viewCategory" element={<ViewCategory />} />

          <Route path="/subCategory" element={<SubCategory />} />
          <Route
            path="/subCategory/addSubCategory"
            element={<AddSubCategory />}
          />
          <Route
            path="/subCategory/editSubCategory"
            element={<EditSubCategory />}
          />
          <Route
            path="/subCategory/viewSubCategory"
            element={<ViewSubCategory />}
          />

          <Route path="/user" element={<User />} />
          <Route path="/user/addUser" element={<AddUser />} />
          <Route path="/user/editUser" element={<EditUser />} />
          <Route path="/user/viewUser" element={<ViewUser />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
