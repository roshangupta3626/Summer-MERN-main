import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return setMessage("All fields are required.");
    }

    try {
      const res = await axios.post("http://localhost:5001/auth/login", formData, {
        withCredentials: true,
      });
      dispatch({ type: "SET_USER", payload: res.data.user });
      navigate("/dashboard");
    } catch {
      setMessage("Invalid username or password.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const res = await axios.post("http://localhost:5001/auth/google-login", { idToken }, { withCredentials: true });
      dispatch({ type: "SET_USER", payload: res.data.user });
      navigate("/dashboard");
    } catch {
      setMessage("Google login failed.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "85vh" }}>
      <div className="card shadow border-primary" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="card-body">
          <h3 className="text-center text-primary mb-3">🔐 Login</h3>
          {message && <div className="alert alert-danger">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Username</label>
              <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <div className="text-center mt-3">
            <p className="text-muted">or login with</p>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setMessage("Google login error")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
