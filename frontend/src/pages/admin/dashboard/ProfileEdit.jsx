import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProfileEdit = ({ token }) => {
  const navigate = useNavigate();

  const [preview, setPreview] = useState("");
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    image: "",
    status: 1,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const tokenToUse = token || localStorage.getItem("token");

      if (!tokenToUse) {
        navigate("/");
        return;
      }
      const response = await axios.get("http://localhost:8000/api/getProfile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response);

      console.log("Token:", token);

      if (response.data.success && response.data.body) {
        setAdmin(response.data.body);
      } else {
        setError("Admin not found");
      }
    } catch (err) {
      setError("API Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", admin.name);
      formData.append("email", admin.email);
      formData.append("phoneNumber", admin.phoneNumber);
      formData.append("status", admin.status);
      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://localhost:8000/api/adminUpdateProfile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(res.data.message);
        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  if (loading) return <h3>Loading Admin...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>Edit Profile</h5>
        <Link to="/dashboard" className="btn btn-primary btn-sm text-white">
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
              onChange={handleImage}
            />
            {admin.image && !preview && (
              <img
                src={`http://localhost:8000/${admin.image.replace(
                  "public/",
                  ""
                )}`}
                alt="Admin"
                width="80"
                height="80"
                style={{
                  marginTop: "10px",
                  borderRadius: "5px",
                  objectFit: "cover",
                }}
              />
            )}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                width="80"
                height="80"
                style={{
                  marginTop: "10px",
                  borderRadius: "5px",
                  objectFit: "cover",
                }}
              />
            )}
          </div>

          {/* Name */}
          <div className="form-group mb-4">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={admin.name}
              onChange={handleChange}
              className="form-control border-bottom"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group mb-4">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={admin.email}
              onChange={handleChange}
              className="form-control border-bottom"
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group mb-4">
            <label>Phone</label>
            <input
              type="number"
              name="phoneNumber"
              value={admin.phoneNumber}
              onChange={handleChange}
              className="form-control border-bottom"
              required
            />
          </div>

          {/* Status */}
          <div className="form-group mb-4">
            <label>Status</label>
            <select
              className="form-control"
              name="status"
              value={admin.status}
              onChange={handleChange}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

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
                onClick={fetchAdmin}
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

export default ProfileEdit;
