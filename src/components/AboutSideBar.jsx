import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { useAuth } from './AuthContext';

const AboutSideBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <ListGroup className="flex-column h-100">
      <ListGroup.Item as={NavLink} to="/account/farmer/profile">
        Profile
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="/account/farmer/stock">
        Stock
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="/account/farmer/order-management">
        Order Management
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="/account/farmer/analytics">
        Analytics
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="/account/farmer/chat">
        Chat
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="/account/farmer/add-stock">
        Add Stock
      </ListGroup.Item>
      <ListGroup.Item action onClick={handleLogout}>
        Sign Out
      </ListGroup.Item>
    </ListGroup>
  );
};

export default AboutSideBar;
