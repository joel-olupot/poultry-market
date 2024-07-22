import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import './StockPage.css';

const StockPage = () => {
  const [stockProducts, setStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Fetch initial stock products from the database
    const fetchStockProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.products);
        if (Array.isArray(response.data.products)) {
          const productsWithImages = response.data.products.map((product) => ({
            ...product,
            imageUrl: arrayBufferToBase64(product.images[0].data.data),
          }));
          setStockProducts(productsWithImages);
        } else {
          setError('Invalid data format');
        }
      } catch (err) {
        setError('Error fetching stock products');
        console.error('Error fetching stock products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockProducts();
  }, [token]);

  const handleRemoveProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedStockProducts = stockProducts.filter(
        (product) => product._id !== productId
      );
      setStockProducts(updatedStockProducts);
    } catch (err) {
      setError('Error removing product');
      console.error('Error removing product:', err);
    }
  };

  const handleClearStock = async () => {
    try {
      await axios.delete('http://localhost:3000/api/v1/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStockProducts([]);
    } catch (err) {
      setError('Error clearing stock');
      console.error('Error clearing stock:', err);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:image/jpeg;base64,${window.btoa(binary)}`;
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0, // No decimal places
    maximumFractionDigits: 0, // No decimal places
  });

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
    return <div>{error}</div>;
  }

  return (
    <div>
      {stockProducts.length > 0 ? (
        <Container className="mt-1 pt-1">
          <h1 className="text-center">Stock Management</h1>
          <Row className="mt-4">
            {stockProducts.map((product) => (
              <Col
                key={product._id}
                lg={3}
                md={4}
                sm={6}
                xs={12}
                className="mb-4 d-flex justify-content-center"
              >
                <Card className="product-card">
                  <Card.Img
                    variant="top"
                    src={product.imageUrl}
                    className="product-image"
                  />
                  <Card.Body>
                    <h5 className="text-primary fs-5">{product.name}</h5>
                    <Card.Text>
                      Quantity Range:{' '}
                      <strong className="text-primary-emphasis">
                        {product.quantity.min} - {product.quantity.max}
                      </strong>
                      <br />
                      Price Range: <br />
                      <strong className="text-primary-emphasis">
                        {formatter.format(product.price.min)} -{' '}
                        {formatter.format(product.price.max)}
                      </strong>
                    </Card.Text>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveProduct(product._id)}
                    >
                      Remove
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col
              lg={3}
              md={4}
              sm={6}
              xs={12}
              className="mb-4 d-flex justify-content-center"
            >
              <Card className="add-product-card">
                <Link to="/account/farmer/add-stock" className="card-link">
                  <Card.Body className="d-flex align-items-center justify-content-center">
                    <h1>+</h1>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          </Row>
          {stockProducts.length > 0 && (
            <div className="clear-stock-button-container">
              <Button variant="danger" onClick={handleClearStock}>
                Clear Stock
              </Button>
            </div>
          )}
        </Container>
      ) : (
        <div className="text-center fs-3 mt-3">
          <strong className="text-light bg-secondary">
            You have no stock.{' '}
            <strong className="text-primary-emphasis bg-light">
              Add stock to get started!
            </strong>
          </strong>
          <br />
          <br />
          <button variant="primary">
            <NavLink
              to="/account/farmer/add-stock"
              className="nav-link text-dark"
            >
              Add Stock
            </NavLink>
          </button>
        </div>
      )}
    </div>
  );
};

export default StockPage;
