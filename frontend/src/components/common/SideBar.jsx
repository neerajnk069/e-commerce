import React from "react";
import { Link, useLocation } from "react-router-dom";

export const SideBar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isActivePrefix = (pathPrefix) => {
    return location.pathname.startsWith(pathPrefix);
  };

  return (
    <aside
      className="sidenav navbar navbar-vertical navbar-expand-xs border-radius-lg fixed-start ms-2 bg-white my-2"
      id="sidenav-main"
    >
      <div className="sidenav-header">
        <i
          className="fas fa-times p-3 cursor-pointer text-dark opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
          aria-hidden="true"
          id="iconSidenav"
        ></i>
        <Link
          className="navbar-brand px-4 py-3 m-0"
          to="/dashboard"
          target="_blank"
        >
          <img
            src="../assets/img/logo-ct-dark.png"
            className="navbar-brand-img"
            width="26"
            height="26"
            alt="main_logo"
          />
          <span className="ms-1 text-sm text-dark">Admin Pannel</span>
        </Link>
      </div>
      <hr className="horizontal dark mt-0 mb-2" />
      <div
        className="collapse navbar-collapse w-auto"
        id="sidenav-collapse-main"
      >
        <ul className="navbar-nav">
          <li className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>
            <Link
              className={`nav-link ${
                isActive("/dashboard")
                  ? "active bg-gradient-dark text-white"
                  : "text-dark"
              }`}
              to="/dashboard"
            >
              <i className="material-symbols-rounded opacity-5 text-dark">
                dashboard
              </i>
              <span className="nav-link-text ms-1">Dashboard</span>
            </Link>
          </li>

          <li className={`nav-item ${isActivePrefix("/user") ? "active" : ""}`}>
            <Link
              className={`nav-link ${
                isActivePrefix("/user")
                  ? "active bg-gradient-dark text-white"
                  : "text-dark"
              }`}
              to="/user"
            >
              <i className="material-symbols-rounded opacity-5"></i>
              <span className="nav-link-text ms-1">UserList</span>
            </Link>
          </li>

          <li
            className={`nav-item ${
              isActivePrefix("/category") ? "active" : ""
            }`}
          >
            <Link
              className={`nav-link ${
                isActivePrefix("/category")
                  ? "active bg-gradient-dark text-white"
                  : "text-dark"
              }`}
              to="/category"
            >
              <i className="material-symbols-rounded opacity-5"></i>
              <span className="nav-link-text ms-1">Categorys</span>
            </Link>
          </li>

          <li
            className={`nav-item ${
              isActivePrefix("/subCategory") ? "active" : ""
            }`}
          >
            <Link
              className={`nav-link ${
                isActivePrefix("/subCategory")
                  ? "active bg-gradient-dark text-white"
                  : "text-dark"
              }`}
              to="/subCategory"
            >
              <i className="material-symbols-rounded opacity-5"></i>
              <span className="nav-link-text ms-1">SubCategory</span>
            </Link>
          </li>

          <li
            className={`nav-item ${isActivePrefix("/product") ? "active" : ""}`}
          >
            <Link
              className={`nav-link ${
                isActivePrefix("/product")
                  ? "active bg-gradient-dark text-white"
                  : "text-dark"
              }`}
              to="/product"
            >
              <i className="material-symbols-rounded opacity-5"></i>
              <span className="nav-link-text ms-1">Products</span>
            </Link>
          </li>

          <li className={`nav-item ${isActive("/order") ? "active" : ""}`}>
            <Link
              className={`nav-link ${
                isActive("/order")
                  ? "active bg-gradient-dark text-white"
                  : "text-dark"
              }`}
              to="/order"
            >
              <i className="material-symbols-rounded opacity-5"></i>
              <span className="nav-link-text ms-1">Orders</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/contact") ? "active" : ""}`}>
            <Link
              className={`nav-link ${
                isActive("/contact")
                  ? "active bg-gradient-dark text-white"
                  : "text-dark"
              }`}
              to="/contact"
            >
              <i className="material-symbols-rounded opacity-5"></i>
              <span className="nav-link-text ms-1">Contact Us</span>
            </Link>
          </li>

          <li className={`nav-item ${isActive("/about") ? "active" : ""}`}>
            <Link
              className={`nav-link ${
                isActive("/about")
                  ? "active bg-gradient-dark text-white"
                  : "text-dark"
              }`}
              to="/about"
            >
              <i className="material-symbols-rounded opacity-5"></i>
              <span className="nav-link-text ms-1">About us</span>
            </Link>
          </li>

          <li
            className={`nav-item ${
              isActive("/privacy-policy") ? "active" : ""
            }`}
          >
            <Link
              className={`nav-link ${
                isActive("/privacy-policy")
                  ? "active bg-gradient-dark text-white"
                  : "text-dark"
              }`}
              to="/privacy-policy"
            >
              <i className="material-symbols-rounded opacity-5"></i>
              <span className="nav-link-text ms-1">PrivacyPolicy</span>
            </Link>
          </li>

          <li
            className={`nav-item ${
              isActive("/terms-condition") ? "active" : ""
            }`}
          >
            <Link
              className={`nav-link ${
                isActive("/terms-condition")
                  ? "active bg-gradient-dark text-white"
                  : "text-dark"
              }`}
              to="/terms-condition"
            >
              <i className="material-symbols-rounded opacity-5"></i>
              <span className="nav-link-text ms-1">TermsCondition</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidenav-footer position-absolute w-100 bottom-0">
        <div className="mx-3"></div>
      </div>
    </aside>
  );
};
