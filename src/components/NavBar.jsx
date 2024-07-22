import React, { useState } from 'react';
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import './NavBar.css';
import { useAuth } from './AuthContext';

const NavBar = () => {
  const location = useLocation();
  const { userType } = useAuth();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="#" className="text-info">
          CLUCKHUB
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarTogglerDemo02" />
        <Navbar.Collapse id="navbarTogglerDemo02">
          <Nav className="me-auto">
            <NavLink to="/home" className="nav-link text-light">
              Home
            </NavLink>
            <NavLink to="/categories" className="nav-link text-light">
              Categories
            </NavLink>
            <NavLink
              to={
                userType === 'farmer'
                  ? '/account/farmer/analytics'
                  : '/account/consumer/cart'
              }
              className={`nav-link text-light ${
                location.pathname.startsWith('/account') ? 'active' : ''
              }`}
            >
              Account
            </NavLink>
            <NavLink to="/about" className="nav-link text-light">
              About Us
            </NavLink>
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-light">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
