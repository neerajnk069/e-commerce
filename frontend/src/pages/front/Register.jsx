import React, { useState } from "react";
import { Link } from "react-router-dom";
import { axios } from "axios";

const Register = () => {
  const [useData, setUseData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    countryCode: "",
    image: null,
    password: "",
    confirmPassword: "",
  });
  return (
    <div>
      <section>
        <div className="page-header min-vh-100">
          <div className="container">
            <div className="row">
              <div className="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
                <div
                  className="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
                  style={{
                    backgroundImage:
                      "url('../assets/img/illustrations/illustration-signup.jpg')",
                    backgroundSize: "cover",
                  }}
                ></div>
              </div>
              <div className="col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
                <div className="card card-plain">
                  <div className="card-header">
                    <h4 className="font-weight-bolder">Sign Up</h4>
                    <p className="mb-0">
                      Enter your email and password to register
                    </p>
                  </div>
                  <div className="card-body">
                    <form role="form">
                      <div className="input-group input-group-outline mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="input-group input-group-outline mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" />
                      </div>
                      <div className="input-group input-group-outline mb-3">
                        <label className="form-label">Country Code</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="input-group input-group-outline mb-3">
                        <label className="form-label">Phone Number</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="input-group input-group-outline mb-3">
                        <label className="form-label"></label>
                        <input type="file" className="form-control" />
                      </div>
                      <div className="input-group input-group-outline mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" />
                      </div>
                      <div className="input-group input-group-outline mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" />
                      </div>
                      <div className="form-check form-check-info text-start ps-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          checked
                        />
                        <label
                          className="form-check-label"
                          for="flexCheckDefault"
                        >
                          I agree the
                          <Link
                            href="javascript:;"
                            className="text-dark font-weight-bolder"
                          >
                            Terms and Conditions
                          </Link>
                        </label>
                      </div>
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-lg bg-gradient-dark btn-lg w-100 mt-4 mb-0"
                        >
                          Sign Up
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="card-footer text-center pt-0 px-lg-2 px-1">
                    <p className="mb-2 text-sm mx-auto">
                      Already have an account?
                      <Link
                        to="/"
                        className="text-primary text-gradient font-weight-bold"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
