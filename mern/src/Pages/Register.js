import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = ({ updateUserDetails }) => {
  const [formData, setFormData] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/auth/register", formData, { withCredentials: true });

      if (response.data.message === "User registered successfully") {
        const loginRes = await axios.post("http://localhost:5001/auth/login", {
          username: formData.username,
          password: formData.password,
        }, { withCredentials: true });

        updateUserDetails(loginRes.data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "85vh" }}>
      <div className="card shadow border-success" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="card-body">
          <h3 className="text-center text-success mb-3">📝 Sign Up</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label>Full Name</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-success w-100">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
