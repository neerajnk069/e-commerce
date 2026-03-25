import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewSubCategory = () => {
  const location = useLocation();

  const id = location.state?.id;

  const [subCategories, setSubCategories] = useState(null);
  const [error, setError] = useState("");

  const fetchSubCategory = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/viewSubCategory",
        {
          id,
        }
      );

      if (res.data.success) {
        setSubCategories(res.data.body);
      } else {
        setError("subCategory not found");
      }
    } catch (err) {
      setError("API Error");
    }
  };

  useEffect(() => {
    if (!id) {
      setError("SubCategory ID missing");
      return;
    }
    fetchSubCategory();
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!subCategories) return <h3>Loading subCategories...</h3>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>View SubCategory</h5>
        <Link to="/subCategory" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        <p>
          <strong>Category Name:</strong> {subCategories.categoryId.name}
        </p>
        <p>
          <strong>SubCategory Name:</strong> {subCategories.subcategoryname}
        </p>
        <p>
          <strong>Status:</strong>
          {subCategories.status === 1 ? "Active" : "Inactive"}
        </p>
      </div>
    </div>
  );
};

export default ViewSubCategory;
