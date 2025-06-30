import React from "react";
import { Link } from "react-router-dom";

const Home = ({ userDetails }) => {
  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg border-0 w-100" style={{ maxWidth: '650px' }}>
        <div className="card-body text-center p-5 bg-light">
          <h1 className="card-title mb-4 text-primary fw-bold">Welcome to <span className="text-success">Mern</span></h1>
          <p className="lead mb-4">
            {userDetails
              ? `Hello, ${userDetails.name}! You are logged in.`
              : "A modern MERN stack authentication app using React, Express, MongoDB."}
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {!userDetails ? (
              <>
                <Link to="/login" className="btn btn-primary px-4">Login</Link>
                <Link to="/register" className="btn btn-outline-secondary px-4">Sign Up</Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-success px-4">Go to Dashboard</Link>
            )}
          </div>
        </div>
        <div className="card-footer bg-white border-top-0 text-muted small text-center py-3">
          Built with using <strong>React</strong>, <strong>Express</strong> & <strong>Bootstrap</strong>
        </div>
      </div>
    </div>
  );
};

export default Home;
