import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { useAuth } from './AuthContext';

const ConsumerSideBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <ListGroup className="flex-column h-100">
      <ListGroup.Item as={NavLink} to="/account/consumer/profile">
        Profile
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="/account/consumer/cart">
        Cart
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="/account/consumer/chat">
        Chat
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="/account/consumer/history">
        Order History
      </ListGroup.Item>
      <ListGroup.Item action onClick={handleLogout}>
        Sign Out
      </ListGroup.Item>
    </ListGroup>
  );
};

export default ConsumerSideBar;
