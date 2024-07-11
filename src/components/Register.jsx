import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

import './Register.css';

const Register = () => {
  const [registerType, setRegisterType] = useState('consumer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    password: '',
    confirmPassword: '',
    farmName: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegisterTypeChange = (type) => {
    setRegisterType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      address: formData.address,
      password: formData.password,
      userType: registerType,
      ...(registerType === 'farmer' && { farmName: formData.farmName }),
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/auth/register`,
        payload
      );
      const { token, user } = response.data;
      // console.log(token);
      register(token, user.userType);
      if (user.userType === 'consumer') {
        navigate('/account/consumer');
      }
      if (user.userType === 'farmer') {
        navigate('/account/farmer');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container className="mt-1">
      <div className="text-center text-primary">
        <strong>Register </strong>to get started! OR <strong>Login </strong>to
        get back.
      </div>
      <br />
      <Row className="justify-content-md-center mt-1">
        <Col md={6}>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded">
            <Card.Body>
              <h3>Register</h3>
              <div className="d-flex justify-content-center mb-4 button-group">
                <Button
                  variant={
                    registerType === 'consumer' ? 'primary' : 'outline-primary'
                  }
                  onClick={() => handleRegisterTypeChange('consumer')}
                  className={`button-left ${
                    registerType === 'consumer' ? 'active' : ''
                  }`}
                >
                  Consumer
                </Button>
                <Button
                  variant={
                    registerType === 'farmer' ? 'primary' : 'outline-primary'
                  }
                  onClick={() => handleRegisterTypeChange('farmer')}
                  className={`button-right ${
                    registerType === 'farmer' ? 'active' : ''
                  }`}
                >
                  Farmer
                </Button>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Name"
                    className="custom-input"
                  />
                </Form.Group>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Email"
                    className="custom-input"
                  />
                </Form.Group>
                <Form.Group controlId="contact" className="mb-3">
                  <Form.Control
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                    placeholder="Contact"
                    className="custom-input"
                  />
                </Form.Group>
                <Form.Group controlId="address" className="mb-3">
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Address"
                    className="custom-input"
                  />
                </Form.Group>
                {registerType === 'farmer' && (
                  <Form.Group controlId="farmName" className="mb-3">
                    <Form.Control
                      type="text"
                      name="farmName"
                      value={formData.farmName}
                      onChange={handleInputChange}
                      required
                      placeholder="Farm Name"
                      className="custom-input"
                    />
                  </Form.Group>
                )}
                <Form.Group controlId="password" className="mb-3">
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Password"
                    className="custom-input"
                  />
                </Form.Group>
                <Form.Group controlId="confirmPassword" className="mb-3">
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    placeholder="Confirm Password"
                    className="custom-input"
                  />
                </Form.Group>
                {error && <p className="text-danger">{error}</p>}
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    type="submit"
                    className="register-button"
                  >
                    Register
                  </Button>
                </div>
                <div className="text-center mt-3">
                  <Link to="/login" className="login-link">
                    Already have an account? Login
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
