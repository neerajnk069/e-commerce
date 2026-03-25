import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NotificationDropdown from "./NotificationDropdown";

const NavBar = () => {
  return (
    <div>
      <nav
        className="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl"
        id="navbarBlur"
        data-scroll="true"
      >
        <div className="container-fluid py-1 px-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
              <li className="breadcrumb-item text-sm">
                <Link className="opacity-5 text-dark" to="javascript:;">
                  Pages
                </Link>
              </li>
              <li
                className="breadcrumb-item text-sm text-dark active"
                aria-current="page"
              >
                Dashboard
              </li>
            </ol>
          </nav>
          <div
            className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
            id="navbar"
          >
            <div className="ms-md-auto pe-md-3 d-flex align-items-center">
              <div className="input-group input-group-outline">
                <label className="form-label">Type here...</label>
                <input type="text" className="form-control" />
              </div>
            </div>
            <ul className="navbar-nav d-flex align-items-center  justify-content-end">
              <li className="nav-item d-flex align-items-center">
                <Link
                  className="btn btn-outline-primary btn-sm mb-0 me-3"
                  target="_blank"
                  to=""
                >
                  Search
                </Link>
              </li>
              <li className="nav-item dropdown px-3 d-flex align-items-center">
                <a
                  href="#"
                  className="nav-link text-body p-0"
                  id="settingsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="material-symbols-rounded fixed-plugin-button-nav">
                    settings
                  </i>
                </a>

                <ul
                  className="dropdown-menu dropdown-menu-end shadow px-2 py-3"
                  aria-labelledby="settingsDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item text-danger d-flex align-items-center"
                      onClick={async () => {
                        const token = localStorage.getItem("token");

                        try {
                          await axios.post(
                            "http://localhost:8000/api/logout",
                            {},
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                        } catch (error) {
                          console.error("Logout API Error:", error);
                        }

                        localStorage.clear();
                        window.location.href = "/login";
                      }}
                    >
                      <i className="material-symbols-rounded me-2">logout</i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>

              <div className="nav-item dropdown pe-3 d-flex align-items-center">
                <NotificationDropdown />
              </div>
              <li className="nav-item d-flex align-items-center">
                <Link
                  to="/profile"
                  className="nav-link text-body font-weight-bold px-0"
                >
                  <i className="material-symbols-rounded">account_circle</i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
