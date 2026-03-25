import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const EditSubCategory = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const id = state?.id;

  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState({
    categoryId: "",
    subcategoryname: "",
    status: "",
    image: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:8000/api/getAllCategory");
    if (res.data.success) setCategories(res.data.body);
  };

  const fetchSubCategory = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/viewSubCategory",
        { id }
      );

      if (response.data.success && response.data.body) {
        const data = response.data.body;

        setSubCategories({
          categoryId: data.categoryId?._id,
          subcategoryname: data.subcategoryname,
          status: data.status,
          image: data.image,
        });

        setPreview(`http://localhost:8000${data.image}`);
      }
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCategories();
      fetchSubCategory();
    }
  }, [id]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setSubCategories({ ...subCategories, [e.target.name]: e.target.value });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!subCategories.categoryId)
      newErrors.categoryId = "Category is required";

    if (!subCategories.subcategoryname.trim())
      newErrors.subcategoryname = "SubCategory Name is required";

    if (!subCategories.status) newErrors.status = "Status is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("categoryId", subCategories.categoryId);
      formData.append("subcategoryname", subCategories.subcategoryname);
      formData.append("status", Number(subCategories.status));

      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://localhost:8000/api/updateSubCategory",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setSuccess("SubCategory Updated Successfully!");
        setTimeout(() => navigate("/subCategory"), 1200);
      }
    } catch (err) {
      console.log("Update Error:", err);
    }
  };

  const handleReset = () => {
    setSubCategories({
      categoryId: "",
      subcategoryname: "",
      status: "",
      image: "",
    });
    setPreview("");
    setErrors({});
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between">
        <h5>Edit SubCategory</h5>
        <Link to="/subCategory" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Category</label>
            <select
              name="categoryId"
              value={subCategories.categoryId}
              onChange={handleChange}
              className={`form-control ${
                errors.categoryId ? "border-danger" : ""
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <small className="text-danger">{errors.categoryId}</small>
            )}
          </div>

          <div className="form-group mb-3">
            <label>SubCategory Name</label>
            <input
              type="text"
              name="subcategoryname"
              value={subCategories.subcategoryname}
              onChange={handleChange}
              className={`form-control ${
                errors.subcategoryname ? "border-danger" : ""
              }`}
            />
            {errors.subcategoryname && (
              <small className="text-danger">{errors.subcategoryname}</small>
            )}
          </div>

          <div className="form-group mb-3">
            <label>Status</label>
            <select
              name="status"
              value={subCategories.status}
              onChange={handleChange}
              className={`form-control ${errors.status ? "border-danger" : ""}`}
            >
              <option value="">Select Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
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

export default EditSubCategory;
