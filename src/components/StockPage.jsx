import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
    <Container fluid className="px-0 pt-1">
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
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                  Quantity: {product.quantity.min}-{product.quantity.max}
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
  );
};

export default StockPage;
