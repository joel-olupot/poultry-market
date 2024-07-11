import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap';
import { List } from 'react-bootstrap-icons';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from './AuthContext';
import AboutSideBar from './AboutSideBar';
import './NavAndSidebar.css';
import ProfilePage from './ProfilePage';
import StockPage from './StockPage';
import OrderManagementPage from './OrderManagement';
import Analytics from './Analytics';
import ChatPage from './ChatPage';
import AddStock from './AddStock';

const NavAndSidebar = () => {
  const { userType } = useAuth;
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (userType !== 'farmer') {
  //     navigate('/login');
  //   }
  // }, [userType, navigate]);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div>
      <Button
        variant="primary"
        className="d-md-none sidebar-toggle-button"
        onClick={toggleSidebar}
      >
        <List size={24} />
      </Button>
      <Offcanvas
        show={showSidebar}
        onHide={toggleSidebar}
        className="d-md-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Account</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AboutSideBar />
        </Offcanvas.Body>
      </Offcanvas>
      <div className="main-content">
        <div className="fixed-sidebar d-none d-md-block">
          <AboutSideBar />
        </div>
        <div className="content-container">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/account/farmer/analytics" />}
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="order-management" element={<OrderManagementPage />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="add-stock" element={<AddStock />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default NavAndSidebar;
