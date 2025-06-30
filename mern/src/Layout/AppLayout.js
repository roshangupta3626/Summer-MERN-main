// Layout/AppLayout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const AppLayout = ({ children, userDetails, updateUserDetails }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header userDetails={userDetails} updateUserDetails={updateUserDetails} />
      <main className="flex-grow-1 bg-light py-4">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
