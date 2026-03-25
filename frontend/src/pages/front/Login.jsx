import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import socket from "../../socket";
const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("user"));

  // const navi = async () => {
  //   if (auth) {
  //     navigate("/dashboard");
  //   }
  // };

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   if (user?._id) {
  //     socket.connect();

  //     socket.emit("registerUser", {
  //       userId: user._id,
  //       role: user.role,
  //     });
  //   }
  //   navi();
  // }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        const user = response.data.body;
        localStorage.setItem("token", response.data.body.token);
        localStorage.setItem("user", JSON.stringify(response.data.body));
        if (socket.connected) {
          socket.emit("registerUser", {
            userId: user._id,
            role: user.role,
          });
        } else {
          socket.on("connect", () => {
            socket.emit("registerUser", {
              userId: user._id,
              role: user.role,
            });
          });
        }
        navigate("/dashboard");
      }

      console.log(response, "data-login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        className="page-header align-items-start min-vh-100"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <span className="mask bg-gradient-dark opacity-6"></span>
        <div className="container my-auto">
          <div className="row">
            <div className="col-lg-4 col-md-8 col-12 mx-auto">
              <div className="card z-index-0 fadeIn3 fadeInBottom">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
                    <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">
                      Sign in
                    </h4>
                    <div className="row mt-3">
                      <div className="col-2 text-center ms-auto">
                        <Link className="btn btn-link px-3" to="#">
                          <i className="fa fa-facebook text-white text-lg"></i>
                        </Link>
                      </div>
                      <div className="col-2 text-center px-1">
                        <Link className="btn btn-link px-3" to="#">
                          <i className="fa fa-github text-white text-lg"></i>
                        </Link>
                      </div>
                      <div className="col-2 text-center me-auto">
                        <Link className="btn btn-link px-3" to="#">
                          <i className="fa fa-google text-white text-lg"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div role="form" className="text-start">
                    <div className="input-group input-group-outline my-3">
                      <label className="form-label" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        onChange={(e) => setemail(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="input-group input-group-outline mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        onChange={(e) => setpassword(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="form-check form-switch d-flex align-items-center mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label
                        className="form-check-label mb-0 ms-3"
                        htmlFor="rememberMe"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="text-center">
                      <button
                        onClick={handleLogin}
                        type="button"
                        className="btn bg-gradient-dark w-100 my-4 mb-2"
                      >
                        Sign in
                      </button>
                    </div>
                    <p className="mt-4 text-sm text-center">
                      Don't have an account?
                      <Link
                        to="/register"
                        className="text-primary text-gradient font-weight-bold"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
