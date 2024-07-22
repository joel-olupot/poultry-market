import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap';
import { List } from 'react-bootstrap-icons';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from './AuthContext';

import './NavAndSidebar.css';
import ConsumerProfilePage from './ConsumerProfilePage';
import CartPage from './CartPage';
import OrderHistory from './OrderHistory';
import ConsumerSideBar from './ConsumerSideBar';
import ChatPage from './ChatPage';

const NavSidebar = () => {
  const { userType } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userType !== 'consumer') {
      navigate('/login');
    }
  }, [userType, navigate]);

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
          <ConsumerSideBar />
        </Offcanvas.Body>
      </Offcanvas>
      <div className="main-content">
        <div className="fixed-sidebar d-none d-md-block">
          <ConsumerSideBar />
        </div>
        <div className="content-container">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/account/consumer/cart" />}
            />
            <Route path="profile" element={<ConsumerProfilePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="history" element={<OrderHistory />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default NavSidebar;
