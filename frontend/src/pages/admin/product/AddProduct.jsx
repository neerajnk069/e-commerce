import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [form, setForm] = useState({
    categoryId: "",
    subCategoryId: "",
    name: "",
    status: "",
  });

  const [image, setImage] = useState(null);

  const [variants, setVariants] = useState([
    { color: "", size: "", price: "", quantity: "" },
  ]);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get(
          "http://localhost:8000/api/getAllCategory",
        );
        const subRes = await axios.get(
          "http://localhost:8000/api/getAllSubCategory",
        );

        if (catRes.data.success) setCategories(catRes.data.body);
        if (subRes.data.success) setSubCategories(subRes.data.body);
      } catch (err) {
        console.error("Error fetching categories/subcategories:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, categoryId: value, subCategoryId: "" });
    setErrors({ ...errors, categoryId: "", subCategoryId: "" });
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...variants];
    updated[index][name] = value;
    setVariants(updated);
    setErrors({ ...errors, [`variant_${index}_${name}`]: "" });
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: "", size: "", price: "", quantity: "" },
    ]);
  };

  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  const validate = () => {
    let newErrors = {};

    if (!image) newErrors.image = "Product Image is required";
    if (!form.categoryId) newErrors.categoryId = "Please select category";
    if (!form.subCategoryId)
      newErrors.subCategoryId = "Please select subcategory";
    if (!form.name.trim()) newErrors.name = "Product Name is required";
    if (!form.status) newErrors.status = "Please select status";

    variants.forEach((v, i) => {
      if (!v.color) newErrors[`variant_${i}_color`] = "Color required";
      if (!v.size) newErrors[`variant_${i}_size`] = "Size required";
      if (!v.price) newErrors[`variant_${i}_price`] = "Price required";
      if (!v.quantity) newErrors[`variant_${i}_quantity`] = "Quantity required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("categoryId", form.categoryId);
    formData.append("subCategoryId", form.subCategoryId);
    formData.append("name", form.name);
    formData.append("status", form.status);
    formData.append("image", image);
    formData.append("variants", JSON.stringify(variants));

    try {
      const res = await axios.post(
        "http://localhost:8000/api/addProduct",
        formData,
      );
      if (res.data.success) {
        setSuccess("Product added successfully!");
        setTimeout(() => navigate("/product"), 1500);
      } else {
        setErrors({ form: res.data.message });
      }
    } catch (err) {
      setErrors({ form: "API Error: " + err.message });
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>Add Product</h5>
        <Link to="/product" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group mb-3">
            <label>Product Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setErrors({ ...errors, image: "" });
              }}
              style={{ borderColor: errors.image ? "red" : "" }}
            />
            {errors.image && (
              <small style={{ color: "red" }}>{errors.image}</small>
            )}
          </div>

          <div className="form-group mb-3">
            <label>Category</label>
            <select
              id="categoryId"
              className="form-control"
              value={form.categoryId}
              onChange={handleCategoryChange}
              style={{ borderColor: errors.categoryId ? "red" : "" }}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <small style={{ color: "red" }}>{errors.categoryId}</small>
            )}
          </div>

          <div className="form-group mb-3">
            <label>SubCategory</label>
            <select
              id="subCategoryId"
              className="form-control"
              value={form.subCategoryId}
              onChange={handleChange}
              style={{ borderColor: errors.subCategoryId ? "red" : "" }}
            >
              <option value="">Select SubCategory</option>
              {subCategories
                .filter((s) => {
                  const catId =
                    typeof s.categoryId === "object"
                      ? s.categoryId._id
                      : s.categoryId;
                  return catId === form.categoryId;
                })
                .map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subcategoryname}
                  </option>
                ))}
            </select>

            {errors.subCategoryId && (
              <small style={{ color: "red" }}>{errors.subCategoryId}</small>
            )}
          </div>

          {/* Product Name */}
          <div className="form-group mb-3">
            <label>Product Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                    .replace(/^\s+/g, "")
                    .replace(/\s{2,}/g, " "),
                })
              }
              style={{ borderColor: errors.name ? "red" : "" }}
            />
            {errors.name && (
              <small style={{ color: "red" }}>{errors.name}</small>
            )}
          </div>

          {/* Status */}
          <div className="form-group mb-3">
            <label>Status</label>
            <select
              id="status"
              className="form-control"
              value={form.status}
              onChange={handleChange}
              style={{ borderColor: errors.status ? "red" : "" }}
            >
              <option value="">Select Status</option>
              <option value="1">Active</option>
              <option value="2">Inactive</option>
            </select>
            {errors.status && (
              <small style={{ color: "red" }}>{errors.status}</small>
            )}
          </div>

          {/* Variants */}
          <h5 className="mt-4">Variants</h5>
          {variants.map((variant, index) => (
            <div className="row mb-3" key={index}>
              {["color", "size", "price", "quantity"].map((field, i) => (
                <div className="col" key={i}>
                  <input
                    type={
                      field === "price" || field === "quantity"
                        ? "number"
                        : "text"
                    }
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="form-control"
                    value={variant[field]}
                    onChange={(e) => handleVariantChange(index, e)}
                    style={{
                      borderColor: errors[`variant_${index}_${field}`]
                        ? "red"
                        : "",
                    }}
                  />
                  {errors[`variant_${index}_${field}`] && (
                    <small style={{ color: "red" }}>
                      {errors[`variant_${index}_${field}`]}
                    </small>
                  )}
                </div>
              ))}
              {index > 0 && (
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-danger mt-1"
                    onClick={() => removeVariant(index)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary mb-4"
            onClick={addVariant}
          >
            Add Variant
          </button>

          {/* Submit/Reset */}
          <div className="row">
            <div className="col-sm-6 d-grid">
              <button type="submit" className="btn btn-primary text-white">
                Submit
              </button>
            </div>
            <div className="col-sm-6 d-grid">
              <button
                type="reset"
                className="btn btn-warning text-white"
                onClick={() => {
                  setForm({
                    categoryId: "",
                    subCategoryId: "",
                    name: "",
                    status: "",
                  });
                  setImage(null);
                  setVariants([
                    { color: "", size: "", price: "", quantity: "" },
                  ]);
                  setErrors({});
                  setSuccess("");
                }}
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

export default AddProduct;
