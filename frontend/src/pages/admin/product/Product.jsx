import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../../../socket";
import Swal from "sweetalert2";

const Product = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/getAllProduct?time=" + Date.now(),
      );

      if (response.data?.success && Array.isArray(response.data.body)) {
        setProducts(response.data.body);
        setError("");
      } else {
        setProducts([]);
        setError("No products found");
      }
    } catch (err) {
      console.error(err);
      setProducts([]);
      setError("API Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id && !socket.connected) {
      socket.connect();
      socket.emit("registerUser", {
        userId: user._id,
        role: user.role,
      });
    }
  }, []);

  useEffect(() => {
    socket.on("productAdded", (newProduct) => {
      setProducts((prev) => [newProduct, ...prev]);
    });

    socket.on("productStatusChanged", (data) => {
      console.log("product status update successfully");

      setProducts((prev) =>
        prev.map((p) =>
          p._id === data.productId ? { ...p, status: data.status } : p,
        ),
      );
    });

    socket.on("productEdited", (updatedProduct) => {
      console.log("product Edit succssfully");
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
      );
    });

    socket.on("productDeleted", ({ productId }) => {
      console.log("product delete succssfully", productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    });

    return () => {
      socket.off("productStatusChanged");
      socket.off("productEdited");
      socket.off("productDeleted");
      socket.off("productAdded");
    };
  }, []);

  const deleteProduct = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post("http://localhost:8000/api/deleteProduct", { id });
          // setProducts(products.filter((p) => p._id !== id));
          Swal.fire("Deleted!", "Product has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error!", "Failed to delete product.", "error");
        }
      }
    });
  };

  const viewProduct = (id) => {
    navigate("/product/view", { state: { id } });
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const res = await axios.post(
        "http://localhost:8000/api/toggleStatusProduct",
        { id, status: newStatus },
      );

      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p)),
        );
        socket.emit("productStatusUpdate", {
          productId: id,
          status: newStatus,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h3>Loading Products...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Products</h5>
          <Link to="/product/add" className="btn btn-primary">
            Add Product
          </Link>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Product Image</th>
                <th>Category</th>
                <th>SubCategory</th>
                <th>Product Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    No Products Found
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={
                          product.image
                            ? `http://localhost:8000/api/uploads/${product.image
                                .split("/")
                                .pop()}`
                            : "https://via.placeholder.com/50"
                        }
                        alt={product.productname}
                        width="50"
                        height="50"
                        style={{ borderRadius: "5px", objectFit: "cover" }}
                      />
                    </td>
                    <td>{product.categoryId?.name || "N/A"}</td>
                    <td>{product.subCategoryId?.subcategoryname || "N/A"}</td>
                    <td>{product.name}</td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          product.status === 1 ? "btn-success" : "btn-danger"
                        }`}
                        onClick={() =>
                          toggleStatus(product._id, product.status)
                        }
                      >
                        {product.status === 1 ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning mx-1"
                        onClick={() =>
                          navigate("/product/edit", {
                            state: { id: product._id },
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger mx-1"
                        onClick={() => deleteProduct(product._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => viewProduct(product._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Product;
