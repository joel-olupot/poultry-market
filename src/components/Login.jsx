import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, userType } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/auth/login`,
        formData
      );
      console.log(response);
      const { token, user } = response.data;
      // console.log(token);
      login(token, user.userType);
      if (user.userType === 'consumer') {
        navigate('/account/consumer');
      }
      if (user.userType === 'farmer') {
        navigate('/account/farmer');
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        return setError('Network error');
      }
      setError('Invalid email or password');
    }
  };

  return (
    <Container className="mt-1">
      <div className="text-center text-primary">
        <strong>Login </strong> to access your account! OR{' '}
        <strong>Register</strong> to create one.
      </div>
      <Row className="justify-content-md-center mt-3">
        <Col md={8} lg={6}>
          <Card className="shadow-lg p-4 mb-5 bg-white rounded">
            <Card.Body>
              <h3 className="text-center mb-4">Login</h3>
              <Form onSubmit={handleSubmit}>
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
                {error && <p className="text-danger">{error}</p>}
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    type="submit"
                    className="login-button"
                  >
                    Login
                  </Button>
                </div>
                <div className="text-center mt-3">
                  <Link to="/register" className="register-link">
                    Register
                  </Link>
                  <span className="mx-2">|</span>
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot Password
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

export default Login;
