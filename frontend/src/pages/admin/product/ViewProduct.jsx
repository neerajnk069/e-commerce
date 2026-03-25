import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewProduct = () => {
  const location = useLocation();
  const id = location.state?.id;

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/viewProduct/${id}`,
      );

      if (res.data.success) {
        let fetchedProduct = res.data.product;

        fetchedProduct.variants = Array.isArray(fetchedProduct.variants)
          ? fetchedProduct.variants
          : [];
        console.log("Fetched Product:", fetchedProduct);
        setProduct(fetchedProduct);
      } else {
        setError(res.data.message || "Product not found");
      }
    } catch (err) {
      setError("API Error: " + err.message);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Product ID missing");
      return;
    }
    fetchProduct();
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!product) return <h3>Loading product...</h3>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>View Product</h5>
        <Link to="/product" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        <div className="mb-3">
          <label className="fw-bold">Product Image:</label> <br />
          <img
            src={
              product.image
                ? `http://localhost:8000/api/uploads/${product.image
                    .split("/")
                    .pop()}`
                : "https://via.placeholder.com/150"
            }
            alt="product"
            width="100"
            height="100"
            style={{ borderRadius: "5px", objectFit: "cover" }}
          />
        </div>

        <p>
          <strong>Category Name:</strong> {product.category.name}
        </p>
        <p>
          <strong>SubCategory Name:</strong>{" "}
          {product.subCategory.subcategoryname}
        </p>
        <p>
          <strong>Product Name:</strong> {product.name}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {product.status === 1 ? "Active" : "Inactive"}
        </p>

        <h5 className="mt-4">Variants</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Color</th>
              <th>Size</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {product.variants && product.variants.length > 0 ? (
              product.variants.map((v, index) => (
                <tr key={v._id}>
                  <td>{index + 1}</td>
                  <td>{v.color}</td>
                  <td>{v.size}</td>
                  <td>{v.price}</td>
                  <td>{v.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No variants available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewProduct;
