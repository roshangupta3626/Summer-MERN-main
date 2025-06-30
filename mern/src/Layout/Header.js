// Layout/Header.js
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ userDetails, updateUserDetails }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5001/auth/logout', {}, { withCredentials: true });
      updateUserDetails(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav
  className="navbar navbar-expand-lg navbar-dark"
  style={{
    backgroundColor: '#1e88e5', // Modern medium blue
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }}
>


      <div className="container">
        <Link className="navbar-brand fw-bold text-white" to="/">MyApp</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link text-white" to="/">Home</Link></li>
            {!userDetails ? (
              <>
                <li className="nav-item"><Link className="nav-link text-white" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link text-white" to="/register">SignUp</Link></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link text-white" to="/dashboard">Dashboard</Link></li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
