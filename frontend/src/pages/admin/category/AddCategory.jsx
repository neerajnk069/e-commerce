import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const AddCategory = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    status: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let temp = {};

    if (!image) temp.image = "Image is required";
    if (!form.name.trim()) temp.name = "Name is required";
    if (!form.status) temp.status = "Status is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("status", form.status);
    formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/addCategory",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setSuccess("Category added successfully!");
        setErrors({});

        setTimeout(() => navigate("/category"), 1200);
      } else {
        setErrors({ api: "Failed to add category" });
      }
    } catch (err) {
      setErrors({ api: "API Error: " + err.message });
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>Add Category</h5>
        <Link to="/category" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group mb-4">
            <label htmlFor="image" className="mb-2">
              Image
            </label>
            <input
              type="file"
              id="image"
              className={`form-control ${errors.image ? "is-invalid" : ""}`}
              onChange={(e) => setImage(e.target.files[0])}
            />
            {errors.image && (
              <small className="text-danger">{errors.image}</small>
            )}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="name" className="mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              onChange={handleChange}
            />
            {errors.name && (
              <small className="text-danger">{errors.name}</small>
            )}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="status" className="mb-2">
              Status
            </label>
            <select
              id="status"
              className={`form-control ${errors.status ? "is-invalid" : ""}`}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="0">Inactive</option>
              <option value="1">Active</option>
            </select>
            {errors.status && (
              <small className="text-danger">{errors.status}</small>
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

export default AddCategory;
