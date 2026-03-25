import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewUser = () => {
  const location = useLocation();
  const id = location.state?.id;

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/viewUser/${id}`);

      if (res.data.success) {
        setUser(res.data.body);
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("API Error");
    }
  };

  useEffect(() => {
    if (!id) {
      setError("User ID missing");
      return;
    }
    fetchUser();
  }, [id]);

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;
  if (!user) return <h3>Loading user...</h3>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>View User</h5>
        <Link to="/user" className="btn btn-primary btn-sm text-white">
          Back
        </Link>
      </div>

      <div className="card-body">
        <div className="mb-3">
          <label className="fw-bold">Image:</label> <br />
          <img
            src={
              user.image
                ? `http://localhost:8000/api/uploads/${user.image
                    .split("/")
                    .pop()}`
                : "https://via.placeholder.com/50"
            }
            alt="user"
            width="50"
            height="50"
            style={{ borderRadius: "5px", objectFit: "cover" }}
          />
        </div>

        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phoneNumber}
        </p>
        <p>
          <strong>Role:</strong> {user.role === 0 ? "Admin" : "User"}
        </p>
        <p>
          <strong>Status:</strong> {user.status === 0 ? "Inactive" : "Active"}
        </p>
      </div>
    </div>
  );
};

export default ViewUser;
