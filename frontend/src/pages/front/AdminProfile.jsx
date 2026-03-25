import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      console.error("No token found. Redirect to login.");
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/adminGetProfile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          localStorage.setItem("token", res.data.body.token);

          setTimeout(() => {
            navigate("/profile");
          }, 50);
        }

        console.log("API RESPONSE >>> ", res.data.body);

        setProfile(res.data.body);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const fd = new FormData();
    fd.append("name", profile.name);
    fd.append("phoneNumber", profile.phoneNumber);

    if (profile.image instanceof File) {
      fd.append("image", profile.image);
    }

    try {
      await axios.post("http://localhost:8000/api/adminUpdateProfile", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <h3>Loading...</h3>;
  if (!profile) return <h3>Admin not found</h3>;

  return (
    <div className="container mt-5">
      <h2>Admin Profile</h2>
      <div className="card p-4 shadow">
        {/* Image */}
        <div className="text-center mb-3">
          <img
            src={
              profile.image instanceof File
                ? URL.createObjectURL(profile.image)
                : profile.image
                ? `http://localhost:8000/api/uploads/${profile.image
                    .split("/")
                    .pop()}`
                : "https://via.placeholder.com/120"
            }
            alt="profile"
            className="rounded-circle"
            width={120}
            height={120}
          />

          {editMode && (
            <input
              type="file"
              className="form-control mt-2"
              onChange={(e) =>
                setProfile({ ...profile, image: e.target.files[0] })
              }
            />
          )}
        </div>

        {/* Name */}
        <div className="mb-2">
          <label>Name</label>
          {editMode ? (
            <input
              type="text"
              className="form-control"
              value={profile.name}
              onChange={(e) => {
                let value = e.target.value;
                value = value.replace(/^\s+/g, "");
                value = value.replace(/\s{2,}/g, " ");
                setProfile({ ...profile, name: value });
              }}
            />
          ) : (
            <p>{profile.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-2">
          <label>Email</label>
          <p>{profile.email}</p>
        </div>

        {/* Phone */}
        <div className="mb-2">
          <label>Phone</label>
          {editMode ? (
            <input
              type="text"
              className="form-control"
              value={profile.phoneNumber}
              onChange={(e) => {
                let value = e.target.value;
                value = value.replace(/^\s+/g, "");
                value = value.replace(/\s{2,}/g, " ");
                setProfile({ ...profile, phoneNumber: value });
              }}
            />
          ) : (
            <p>{profile.phoneNumber}</p>
          )}
        </div>

        {/* Buttons */}
        {!editMode ? (
          <button className="btn btn-primary" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        ) : (
          <>
            <button className="btn btn-success" onClick={handleUpdate}>
              Save
            </button>
            <button
              className="btn btn-secondary ms-2"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
