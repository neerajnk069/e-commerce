import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewCategory = () => {
  const location = useLocation();

  const id = location.state?.id;

  const [categories, setCategories] = useState(null);
  const [error, setError] = useState("");

  const fetchCategory = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/viewCategory", {
        id,
      });

      if (res.data.success) {
        setCategories(res.data.body);
      } else {
        setError("Category not found");
      }
    } catch (err) {
      setError("API Error");
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Category ID missing");
      return;
    }
    fetchCategory();
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!categories) return <h3>Loading categories...</h3>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>View Category</h5>
        <Link to="/category" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        <div className="mb-3">
          <label className="fw-bold">Image:</label> <br />
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
        </div>

        <p>
          <strong>Name:</strong> {categories.name}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {categories.status === 0 ? "Inactive" : "Active"}
        </p>
      </div>
    </div>
  );
};

export default ViewCategory;
