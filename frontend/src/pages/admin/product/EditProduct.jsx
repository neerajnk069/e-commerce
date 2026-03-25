import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const EditProduct = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const id = state?.id;

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [preview, setPreview] = useState("");

  const [product, setProduct] = useState({
    categoryId: "",
    subCategoryId: "",
    name: "",
    image: "",
  });

  const [variants, setVariants] = useState([]);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let temp = {};

    if (!product.categoryId) temp.categoryId = "Category required";
    if (!product.subCategoryId) temp.subCategoryId = "SubCategory required";
    if (!product.name.trim()) temp.name = "Product name required";

    variants.forEach((v, i) => {
      if (!v.color) temp[`color${i}`] = "Color required";
      if (!v.size) temp[`size${i}`] = "Size required";
      if (!v.price) temp[`price${i}`] = "Price required";
      if (!v.quantity) temp[`quantity${i}`] = "Quantity required";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/viewProduct/${id}`
      );
      if (res.data.success) {
        const p = res.data.product;

        setProduct({
          categoryId: p.category?._id || "",
          subCategoryId: p.subCategory?._id || "",
          name: p.name || "",
          image: p.image || "",
        });

        setVariants(p.variants || []);

        if (p.image) {
          setPreview(
            `http://localhost:8000/api/uploads/${p.image.split("/").pop()}`
          );
        }
      }
    } catch (err) {
      console.log("Fetch Product Error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/getAllCategory");
      if (res.data.success) setCategories(res.data.body);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/getAllSubCategory"
      );
      if (res.data.success) setSubCategories(res.data.body);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "categoryId") {
      setProduct((prev) => ({ ...prev, subCategoryId: "" }));
      setErrors((prev) => ({ ...prev, subCategoryId: "" }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...variants];
    updated[index][name] = value;
    setVariants(updated);

    setErrors((prev) => ({ ...prev, [`${name}${index}`]: "" }));
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: "", size: "", price: "", quantity: "" },
    ]);
  };

  const removeVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);

    const updatedErrors = { ...errors };
    ["color", "size", "price", "quantity"].forEach((field) => {
      delete updatedErrors[`${field}${index}`];
    });
    setErrors(updatedErrors);
  };

  useEffect(() => {
    if (id) {
      fetchCategories();
      fetchSubCategories();
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix form errors!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("categoryId", product.categoryId);
      formData.append("subCategoryId", product.subCategoryId);
      formData.append("name", product.name);
      formData.append("variants", JSON.stringify(variants));

      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://localhost:8000/api/editProduct",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        alert("Product updated successfully!");
        navigate("/product");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log("Update Error:", err);
      alert("Error updating product");
    }
  };

  const handleReset = () => {
    setProduct({ categoryId: "", subCategoryId: "", name: "", image: "" });
    setImage(null);
    setPreview("");
    setVariants([]);
    setErrors({});
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between">
        <h5>Edit Product</h5>
        <Link to="/product" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label>Product Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImage}
            />
            {preview && (
              <img
                src={preview}
                width="80"
                height="80"
                style={{ marginTop: "10px" }}
              />
            )}
          </div>

          <div className="form-group mb-3">
            <label>Category</label>
            <select
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              className={`form-control ${
                errors.categoryId ? "is-invalid" : ""
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <small className="text-danger">{errors.categoryId}</small>
            )}
          </div>

          <div className="form-group mb-3">
            <label>SubCategory</label>
            <select
              name="subCategoryId"
              value={product.subCategoryId}
              onChange={handleChange}
              className={`form-control ${
                errors.subCategoryId ? "is-invalid" : ""
              }`}
            >
              <option value="">Select SubCategory</option>
              {subCategories
                .filter((s) => {
                  const catId =
                    typeof s.categoryId === "object"
                      ? s.categoryId._id
                      : s.categoryId;
                  return String(catId) === String(product.categoryId);
                })
                .map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subcategoryname}
                  </option>
                ))}
            </select>
            {errors.subCategoryId && (
              <small className="text-danger">{errors.subCategoryId}</small>
            )}
          </div>

          <div className="form-group mb-3">
            <label>Product Name</label>
            <input
              name="name"
              value={product.name}
              onChange={(e) => {
                const value = e.target.value.replace(/\s{2,}/g, " ");
                setProduct({ ...product, name: value });
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
            {errors.name && (
              <small className="text-danger">{errors.name}</small>
            )}
          </div>

          <h5 className="mt-4">Variants</h5>
          {variants.map((v, i) => (
            <div className="row mb-3" key={i}>
              <div className="col">
                <input
                  type="text"
                  name="color"
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => handleVariantChange(i, e)}
                  className={`form-control ${
                    errors[`color${i}`] ? "is-invalid" : ""
                  }`}
                />
                {errors[`color${i}`] && (
                  <small className="text-danger">{errors[`color${i}`]}</small>
                )}
              </div>

              <div className="col">
                <input
                  type="text"
                  name="size"
                  placeholder="Size"
                  value={v.size}
                  onChange={(e) => handleVariantChange(i, e)}
                  className={`form-control ${
                    errors[`size${i}`] ? "is-invalid" : ""
                  }`}
                />
                {errors[`size${i}`] && (
                  <small className="text-danger">{errors[`size${i}`]}</small>
                )}
              </div>

              <div className="col">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) => handleVariantChange(i, e)}
                  className={`form-control ${
                    errors[`price${i}`] ? "is-invalid" : ""
                  }`}
                />
                {errors[`price${i}`] && (
                  <small className="text-danger">{errors[`price${i}`]}</small>
                )}
              </div>

              <div className="col">
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={v.quantity}
                  onChange={(e) => handleVariantChange(i, e)}
                  className={`form-control ${
                    errors[`quantity${i}`] ? "is-invalid" : ""
                  }`}
                />
                {errors[`quantity${i}`] && (
                  <small className="text-danger">
                    {errors[`quantity${i}`]}
                  </small>
                )}
              </div>

              <div className="col-auto">
                {i > 0 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeVariant(i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={addVariant}
          >
            Add Variant
          </button>

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

export default EditProduct;
