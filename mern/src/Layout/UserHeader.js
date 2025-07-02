import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UserHeader() {
  const userDetails = useSelector((state) => state.userDetails);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/dashboard">MyApp</Link>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#!" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {userDetails?.name || 'Account'}
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
              <li><Link className="dropdown-item" to="/links">Manage Links</Link></li>
              <li><Link className="dropdown-item" to="/users">Manage Users</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><Link className="dropdown-item" to="/logout">Logout</Link></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default UserHeader;
