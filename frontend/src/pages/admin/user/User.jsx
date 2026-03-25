import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../../../socket";
import Swal from "sweetalert2";

const User = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/userList?time=" + new Date().getTime(),
      );

      console.log("API Response:", response.data);

      if (response.data.success && Array.isArray(response.data.body)) {
        setUsers(response.data.body);
        setError("");
      } else {
        setUsers([]);
        setError("No users found");
      }
    } catch (err) {
      console.log("Fetch Error:", err);
      setError("API Error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
    socket.on("userAdded", (newUser) => {
      setUsers((prev) => [newUser, ...prev]);
    });

    socket.on("userStatusChanged", (data) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === data.userId ? { ...u, status: data.status } : u,
        ),
      );
    });

    socket.on("userEdited", (updatedUser) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)),
      );
    });

    socket.on("userDeleted", ({ userId }) => {
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    });

    return () => {
      socket.off("userStatusChanged");
      socket.off("userEdited");
      socket.off("userDeleted");
      socket.off("userAdded");
    };
  }, []);

  const deleteUser = async (id, name) => {
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
          await axios.post("http://localhost:8000/api/deleteUser", { id });

          // setUsers(users.filter((u) => u.id !== id));

          Swal.fire("Deleted!", `${name} has been deleted.`, "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete user.", "error");
        }
      }
    });
  };
  const viewUser = (id) => {
    navigate(`/user/viewUser`, { state: { id } });
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/toggleStatusUser",
        { id, status: newStatus },
      );

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, status: newStatus } : u)),
        );
        socket.emit("userStatusUpdate", {
          userId: id,
          status: newStatus,
        });
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.log("Toggle Error:", err);
    }
  };

  if (loading) return <h3>Loading Users...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>Users</h5>
        <Link to="/user/addUser" className="btn btn-primary btn-sm text-white">
          Add User
        </Link>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No Users Found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>
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
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.role === 0 ? "Admin" : "User"}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          user.status === 0 ? "btn-danger" : "btn-success"
                        }`}
                        onClick={() => handleToggle(user._id, user.status)}
                      >
                        {user.status === 0 ? "Inactive" : "Active"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() =>
                          navigate("/user/editUser", {
                            state: { id: user._id },
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger mx-2"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => viewUser(user._id)}
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

export default User;
