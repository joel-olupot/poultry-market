import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import './AddStock.css';

const AddStock = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantityMin: '',
    quantityMax: '',
    priceMin: '',
    priceMax: '',
    description: '',
    images: [],
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const images = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: images,
    });
  };

  const clearForm = () => {
    setFormData({
      productName: '',
      quantityMin: '',
      quantityMax: '',
      priceMin: '',
      priceMax: '',
      description: '',
      images: [],
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleCancel = () => {
    clearForm();
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(false);

    const { quantityMin, quantityMax, priceMin, priceMax } = formData;

    if (parseInt(quantityMin) > parseInt(quantityMax)) {
      setError('Max quantity must be greater than or equal to min quantity.');
      setUploading(false);
      clearForm();
      return;
    }

    if (parseInt(priceMin) > parseInt(priceMax)) {
      setError('Max price must be greater than or equal to min price.');
      setUploading(false);
      clearForm();
      return;
    }

    try {
      const data = new FormData();
      data.append('productName', formData.productName);
      data.append('quantityMin', formData.quantityMin);
      data.append('quantityMax', formData.quantityMax);
      data.append('priceMin', formData.priceMin);
      data.append('priceMax', formData.priceMax);
      data.append('description', formData.description);
      formData.images.forEach((image) => {
        data.append('images', image);
      });

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No token found');
        setUploading(false);
        clearForm();
        return;
      }

      const response = await axios.post(
        'http://localhost:3000/api/v1/products',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Response:', response.data);
      setSuccess(true);
      setUploading(false);
      clearForm();
    } catch (err) {
      console.error(err);
      console.log(err);
      setError(err.response?.data?.message || err.message);
      setUploading(false);
      clearForm();
    }
  };

  useEffect(() => {
    let successTimeout;
    let errorTimeout;
    if (success) {
      successTimeout = setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
    if (error) {
      errorTimeout = setTimeout(() => {
        setError(null);
      }, 2000);
    }
    return () => {
      clearTimeout(successTimeout);
      clearTimeout(errorTimeout);
    };
  }, [success, error]);

  return (
    <Container fluid className="px-0 pt-1 mt-4">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded">
            <Card.Body>
              <h3>Add Stock</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && (
                <div className="alert alert-success">
                  Stock added successfully!
                </div>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="productName" className="mb-3">
                  <Form.Control
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                    placeholder="Product Name"
                    className="custom-input"
                  />
                </Form.Group>
                <Form.Group controlId="quantityRange" className="mb-3">
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        name="quantityMin"
                        value={formData.quantityMin}
                        onChange={handleInputChange}
                        required
                        placeholder="Min Quantity"
                        className="custom-input"
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        name="quantityMax"
                        value={formData.quantityMax}
                        onChange={handleInputChange}
                        required
                        placeholder="Max Quantity"
                        className="custom-input"
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group controlId="priceRange" className="mb-3">
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        name="priceMin"
                        value={formData.priceMin}
                        onChange={handleInputChange}
                        required
                        placeholder="Min Price"
                        className="custom-input"
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        name="priceMax"
                        value={formData.priceMax}
                        onChange={handleInputChange}
                        required
                        placeholder="Max Price"
                        className="custom-input"
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group controlId="description" className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief Description"
                    className="custom-input"
                  />
                </Form.Group>
                <Form.Group controlId="images" className="mb-3">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    required
                    className="custom-input"
                    ref={fileInputRef}
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    className="stock-submit-button"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Stock'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    type="button"
                    className="stock-cancel-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddStock;
