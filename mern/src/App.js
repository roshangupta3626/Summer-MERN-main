import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

import Home from './Home';
import Login from './Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import AppLayout from './Layout/AppLayout';

function App() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const [loading, setLoading] = useState(true);

  const updateUserDetails = useCallback((user) => {
    dispatch({ type: user ? 'SET_USER' : 'CLEAR_USER', payload: user });
  }, [dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5001/auth/isUserLoggedIn", {
          withCredentials: true,
        });
        updateUserDetails(res.data.user);
      } catch {
        updateUserDetails(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [updateUserDetails]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout userDetails={userDetails} updateUserDetails={updateUserDetails}>
            <Home userDetails={userDetails} />
          </AppLayout>
        }
      />
      <Route
        path="/login"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout userDetails={userDetails} updateUserDetails={updateUserDetails}>
              <Login updateUserDetails={updateUserDetails} />
            </AppLayout>
          )
        }
      />
      <Route
        path="/register"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout userDetails={userDetails} updateUserDetails={updateUserDetails}>
              <Register updateUserDetails={updateUserDetails} />
            </AppLayout>
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <AppLayout userDetails={userDetails} updateUserDetails={updateUserDetails}>
              <Dashboard userDetails={userDetails} />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
