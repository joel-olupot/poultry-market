import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Form,
  Spinner,
} from 'react-bootstrap';
import './ProfilePage.css';

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [farmerProfile, setFarmerProfile] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    farmName: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchFarmerProfile = async () => {
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setFarmerProfile(response.data.user);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchFarmerProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFarmerProfile({
      ...farmerProfile,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!token) {
      setError('No token found');
      return;
    }

    try {
      await axios.put('http://localhost:3000/api/v1/profile', farmerProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only"></span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container fluid className="px-0 pt-1">
      <h1 className="text-center">Farmer Profile</h1>
      <Row className="mt-4 d-flex justify-content-center">
        <Col md={6} sm={12}>
          <Card className="profile-card">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Profile Information
                {editMode ? (
                  <Button variant="success" size="sm" onClick={handleSave}>
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </Card.Title>
              {editMode ? (
                <Form>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={farmerProfile.name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={farmerProfile.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formContact" className="mt-3">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact"
                      value={farmerProfile.contact}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formAddress" className="mt-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={farmerProfile.address}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formFarm" className="mt-3">
                    <Form.Label>Farm</Form.Label>
                    <Form.Control
                      type="text"
                      name="farmName"
                      value={farmerProfile.farmName}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Form>
              ) : (
                <Card.Text>
                  <strong>Name:</strong> {farmerProfile.name}
                  <br />
                  <strong>Email:</strong> {farmerProfile.email}
                  <br />
                  <strong>Contact:</strong> {farmerProfile.contact}
                  <br />
                  <strong>Address:</strong> {farmerProfile.address}
                  <br />
                  <strong>Farm:</strong> {farmerProfile.farmName}
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
