import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/getAllCategory?time=" + new Date().getTime()
      );

      console.log("API Response:", response.data);

      if (response.data.success && Array.isArray(response.data.body)) {
        setCategories(response.data.body);
        setError("");
      } else {
        setCategories([]);
        setError("No Categories found");
      }
    } catch (err) {
      console.log("Fetch Error:", err);
      setError("API Error");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const goToEdit = (id) => {
    navigate(`/category/editCategory/${id}`);
  };

  const deleteCategory = async (id, name) => {
    Swal.fire({
      title: `Do you want to delete "${name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post("http://localhost:8000/api/deleteCategory", { id });

          setCategories(categories.filter((u) => u.id !== id));

          Swal.fire("Deleted!", `${name} has been deleted.`, "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete categories.", "error");
        }
      }
    });
  };

  const viewCategory = (id) => {
    navigate("/category/viewCategory", { state: { id } });
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      const res = await axios.post("http://localhost:8000/api/toggleStatus", {
        id,
        status: newStatus,
      });

      if (res.data.success) {
        fetchCategory();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.log("Toggle Error:", err);
    }
  };

  if (loading) return <h3>Loading Categories...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>Categories</h5>
        <Link
          to="/category/addCategory"
          className="btn btn-primary btn-sm text-white"
        >
          Add Category
        </Link>
      </div>

      <div className="mb-2 px-3">
        Show
        <select
          id="entriesPerPage"
          className="form-control form-control-sm d-inline-block mx-2"
          style={{ width: "auto" }}
        >
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
        entries
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No Categories Found
                  </td>
                </tr>
              ) : (
                categories.map((categories, index) => (
                  <tr key={categories._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={
                          categories.image
                            ? `http://localhost:8000/api/uploads/${categories.image
                                .split("/")
                                .pop()}`
                            : "https://via.placeholder.com/50"
                        }
                        alt="categories"
                        width="50"
                        height="50"
                        style={{ borderRadius: "5px", objectFit: "cover" }}
                      />
                    </td>
                    <td>{categories.name}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          categories.status === 0 ? "btn-danger" : "btn-success"
                        }`}
                        onClick={() =>
                          handleToggle(categories._id, categories.status)
                        }
                      >
                        {categories.status === 0 ? "Inactive" : "Active"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() =>
                          navigate("/category/editCategory", {
                            state: { id: categories._id },
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger mx-2"
                        onClick={() => deleteCategory(categories._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => viewCategory(categories._id)}
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
    </div>
  );
};

export default Category;
