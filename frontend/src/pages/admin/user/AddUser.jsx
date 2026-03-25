import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const AddUser = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: 1,
    status: 1,
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!form.role) newErrors.role = "Role is required";
    if (!form.status) newErrors.status = "Status is required";
    if (!image) newErrors.image = "Image is required";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setError({});

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phoneNumber", form.phoneNumber);
    formData.append("role", "1");
    formData.append("status", "1");

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/addUser",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setSuccess("User added successfully!");
        setTimeout(() => navigate("/user"), 1200);
      } else {
        setError({ api: "Failed to add user" });
      }
    } catch (err) {
      setError({ api: "API Error: " + err.message });
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>Add User</h5>
        <Link to="/user" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        {error && <p style={{ color: "red" }}>{error.api}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group mb-4">
            <label htmlFor="image" className="mb-2">
              Image
            </label>
            <input
              type="file"
              id="image"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ borderColor: error.image ? "red" : "#ced4da" }}
            />
            {error.image && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {error.image}
              </span>
            )}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="name" className="mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={form.name}
              onChange={(e) => {
                let value = e.target.value;
                value = value.replace(/^\s+/g, "");
                value = value.replace(/\s{2,}/g, " ");
                setForm({ ...form, name: value });
              }}
              style={{ borderColor: error.name ? "red" : "#ced4da" }}
            />
            {error.name && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {error.name}
              </span>
            )}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="email" className="mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
              style={{ borderColor: error.name ? "red" : "#ced4da" }}
            />
            {error.email && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {error.email}
              </span>
            )}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="phoneNumber" className="mb-2">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              className="form-control"
              value={form.phoneNumber}
              onChange={(e) => {
                let value = e.target.value;
                value = value.replace(/^\s+/g, "");
                value = value.replace(/\s{2,}/g, " ");
                setForm({ ...form, phoneNumber: value });
              }}
              style={{ borderColor: error.name ? "red" : "#ced4da" }}
            />
            {error.phoneNumber && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {error.phoneNumber}
              </span>
            )}
          </div>
          <div className="row">
            <div className="col-sm-6 d-grid">
              <button type="submit" className="btn btn-primary text-white">
                Submit
              </button>
            </div>

            <div className="col-sm-6 d-grid">
              <button type="reset" className="btn btn-warning text-white">
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
