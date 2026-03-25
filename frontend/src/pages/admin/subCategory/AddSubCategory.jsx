import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const AddSubCategory = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    categoryId: "",
    subcategoryname: "",
    status: "",
  });

  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/getAllCategory");
      if (res.data.success) {
        setCategories(res.data.body);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });

    setError({ ...error, [e.target.id]: "" });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!form.categoryId) newErrors.categoryId = "Category is required";
    if (!form.subcategoryname.trim())
      newErrors.subcategoryname = "SubCategory name is required";
    if (!form.status) newErrors.status = "Status is required";

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("categoryId", form.categoryId);
    formData.append("subcategoryname", form.subcategoryname);
    formData.append("status", form.status);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/addSubCategory",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setSuccess("SubCategory added successfully!");
        setTimeout(() => navigate("/subCategory"), 1500);
      } else {
        setSuccess("");
        setError({ form: "Failed to add subCategory" });
      }
    } catch (err) {
      setError({ form: "API Error: " + err.message });
      setSuccess("");
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between">
        <h5>Add SubCategory</h5>
        <Link to="/subCategory" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        {error.form && <p style={{ color: "red" }}>{error.form}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label>Select Category</label>
            <select
              id="categoryId"
              className={`form-control ${
                error.categoryId ? "border-danger" : ""
              }`}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option value={cat._id} key={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {error.categoryId && (
              <small className="text-danger">{error.categoryId}</small>
            )}
          </div>

          <div className="form-group mb-4">
            <label>SubCategory Name</label>
            <input
              type="text"
              id="subcategoryname"
              className={`form-control ${
                error.subcategoryname ? "border-danger" : ""
              }`}
              onChange={handleChange}
            />
            {error.subcategoryname && (
              <small className="text-danger">{error.subcategoryname}</small>
            )}
          </div>

          <div className="form-group mb-4">
            <label>Status</label>
            <select
              id="status"
              className={`form-control ${error.status ? "border-danger" : ""}`}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="0">Inactive</option>
              <option value="1">Active</option>
            </select>
            {error.status && (
              <small className="text-danger">{error.status}</small>
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

export default AddSubCategory;
