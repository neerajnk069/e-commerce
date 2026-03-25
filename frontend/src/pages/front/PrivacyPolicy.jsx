import { useEffect, useState, useRef } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const editor = useRef(null);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() < payload.exp * 1000;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    if (!isTokenValid()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Session expired! Please login again.");
      navigate("/");
      return;
    }

    fetchPrivacyPolicy();
  }, [navigate]);

  const fetchPrivacyPolicy = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:8000/api/getByType",
        { type: 2 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success && res.data.body) {
        setTitle(res.data.body.title);
        setDescription(res.data.body.description);
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching privacy policy");
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!title.trim()) tempErrors.title = "Title is required";

    const plainText = description.replace(/<[^>]+>/g, "").trim();
    if (!plainText) tempErrors.description = "Description is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:8000/api/privacy-policy",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
    } catch (error) {
      console.log(error);
      alert("Error saving content");
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) setErrors({ ...errors, title: "" });
  };

  const handleDescriptionChange = (newContent) => {
    setDescription(newContent);
    const plainText = newContent.replace(/<[^>]+>/g, "").trim();
    if (errors.description && plainText) {
      setErrors({ ...errors, description: "" });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Privacy Policy</h2>

      <div className="form-group mb-3">
        <label>Title</label>
        <input
          type="text"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          value={title}
          onChange={handleTitleChange}
        />
        {errors.title && <small className="text-danger">{errors.title}</small>}
      </div>

      <div className="form-group mb-3">
        <label>Description</label>
        <JoditEditor
          ref={editor}
          value={description}
          onChange={handleDescriptionChange}
        />
        {errors.description && (
          <small className="text-danger">{errors.description}</small>
        )}
      </div>

      <button className="btn btn-primary mt-3" onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
};

export default PrivacyPolicy;
