import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const EditUser = () => {
    const { state } = useLocation();
  const navigate = useNavigate();
  const id = state?.id;

  const [preview, setPreview] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    status: "",
    image: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/viewUser/${id}`,
      );
      if (response.data.success && response.data.body) {
        setUser(response.data.body);
      } else {
        setErrors({ fetch: "User not found" });
      }
    } catch (err) {
      setErrors({ fetch: "API Error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const validateForm = () => {
    let newErrors = {};

    if (!user.name.trim()) newErrors.name = "Name is required";
    if (!user.email.trim()) newErrors.email = "Email is required";
    if (!user.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!user.status.toString().trim()) newErrors.status = "Status is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phoneNumber", user.phoneNumber);
      formData.append("status", user.status);

      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://localhost:8000/api/editUser",
        formData,
      );

      if (res.data.success) {
        alert(res.data.message);
        navigate("/user");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error updating user");
    }
  };

  if (loading) return <h3>Loading User...</h3>;
  if (errors.fetch) return <h3 style={{ color: "red" }}>{errors.fetch}</h3>;

  const handleReset = () => {
    setUser({
      name: "",
      email: "",
      phoneNumber: "",
      status: "",
      image: "",
    });
    setErrors({});
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>Edit User</h5>
        <Link to="/user" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Image */}
          <div className="form-group mb-4">
            <label>Image</label>
            <input
              type="file"
              className="form-control border-bottom"
              onChange={(e) => setImage(e.target.files[0])}
            />

            {user.image && !image && (
              <img
                src={
                  user.image.startsWith("http")
                    ? user.image
                    : `http://localhost:8000/api/uploads/${user.image
                        .split("/")
                        .pop()}`
                }
                width="80"
                height="80"
                style={{ marginTop: "10px", borderRadius: "5px" }}
              />
            )}

            {image && (
              <img
                src={URL.createObjectURL(image)}
                width="80"
                height="80"
                style={{ marginTop: "10px", borderRadius: "5px" }}
              />
            )}
          </div>

          {/* Name */}
          <div className="form-group mb-4">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={(e) => {
                let value = e.target.value
                  .replace(/^\s+/g, "")
                  .replace(/\s{2,}/g, " ");
                setUser({ ...user, name: value });
              }}
              className="form-control border-bottom"
            />
            {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group mb-4">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
              className="form-control border-bottom"
              placeholder="Enter your email"
            />
            {errors.email && (
              <span style={{ color: "red" }}>{errors.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className="form-group mb-4">
            <label>Phone</label>
            <input
              type="number"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={(e) =>
                setUser({ ...user, phoneNumber: e.target.value })
              }
              className="form-control border-bottom"
            />
            {errors.phoneNumber && (
              <span style={{ color: "red" }}>{errors.phoneNumber}</span>
            )}
          </div>

          {/* Status */}
          <div className="form-group mb-4">
            <label>Status</label>
            <select
              className="form-control"
              name="status"
              value={user.status}
              onChange={(e) => setUser({ ...user, status: e.target.value })}
            >
              <option value="">Select Status</option>
              <option value="0">Inactive</option>
              <option value="1">Active</option>
            </select>
            {errors.status && (
              <span style={{ color: "red" }}>{errors.status}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="row">
            <div className="col-sm-6 d-grid">
              <button type="submit" className="btn btn-primary text-white">
                Submit
              </button>
            </div>

            <div className="col-sm-6 d-grid">
              <button
                type="button"
                className="btn btn-warning text-white"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
