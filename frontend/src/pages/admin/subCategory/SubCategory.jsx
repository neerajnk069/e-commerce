import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const SubCategory = () => {
  const navigate = useNavigate();

  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/getAllSubCategory?time=" +
          new Date().getTime()
      );

      console.log("API Response:", response.data);

      if (response.data.success && Array.isArray(response.data.body)) {
        setSubCategories(response.data.body);
        setError("");
      } else {
        setSubCategories([]);
        setError("No subCategories found");
      }
    } catch (err) {
      console.log("Fetch Error:", err);
      setError("API Error");
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const goToEdit = (id) => {
    navigate(`/subCategory/editSubCategory/${id}`);
  };

  const deleteSubCategory = async (id, subcategoryname) => {
    Swal.fire({
      title: `Do you want to delete this?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post("http://localhost:8000/api/deleteSubCategory", {
            id,
          });

          setSubCategories(subCategories.filter((u) => u.id !== id));

          Swal.fire("Deleted!", `Deleted successfully.`, "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete subCategories.", "error");
        }
      }
    });
  };
  const viewSubCategory = (id) => {
    navigate("/subCategory/viewSubCategory", { state: { id } });
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/toggleStatusSubCategory",
        {
          id,
          status: newStatus,
        }
      );

      if (res.data.success) {
        fetchSubCategory();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.log("Toggle Error:", err);
    }
  };

  if (loading) return <h3>Loading subCategories...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>subCategories</h5>
        <Link
          to="/subCategory/addSubCategory"
          className="btn btn-primary btn-sm text-white"
        >
          Add subCategory
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
                <th>Category Name</th>
                <th>SubCategory Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {subCategories.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No subCategories Found
                  </td>
                </tr>
              ) : (
                subCategories.map((subCategories, index) => (
                  <tr key={subCategories._id}>
                    <td>{index + 1}</td>
                    <td>{subCategories.categoryId.name}</td>
                    <td>{subCategories.subcategoryname}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          subCategories.status === 1
                            ? "btn-success"
                            : "btn-danger"
                        }`}
                        onClick={() =>
                          handleToggle(subCategories._id, subCategories.status)
                        }
                      >
                        {subCategories.status === 1 ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() =>
                          navigate("/subCategory/editSubCategory", {
                            state: { id: subCategories._id },
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger mx-2"
                        onClick={() => deleteSubCategory(subCategories._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => viewSubCategory(subCategories._id)}
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

export default SubCategory;
