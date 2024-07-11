import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import './HomePage.css';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch items from the database
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/items`);
        if (Array.isArray(response.data.items)) {
          const itemsWithImages = response.data.items.map((item) => ({
            ...item,
            imageUrl: arrayBufferToBase64(item.images[0].data.data),
          }));
          setItems(itemsWithImages);
        } else {
          setError('Invalid data format');
        }
      } catch (err) {
        setError('Error fetching items');
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

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
    <div>
      <NavBar />
      <Container className="mt-4">
        <Row>
          {items.map((item) => (
            <Col
              key={item._id}
              lg={3}
              md={4}
              sm={6}
              xs={12}
              className="mb-4 d-flex justify-content-center"
            >
              <Link
                to={{ pathname: `/details/${item._id}`, state: { item } }}
                className="card-link w-100"
              >
                <Card className="item-card">
                  <Card.Img
                    variant="top"
                    src={item.imageUrl}
                    className="item-image"
                    alt={item.name}
                  />
                  <Card.Body>
                    <Card.Text>
                      {item.name}
                      <br />
                      <strong>Farm:</strong> {item.farmName}
                      <br />
                      <strong>Quantity:</strong> {item.quantity.min}-
                      {item.quantity.max}
                      <br />
                      <strong>Price:</strong> ${item.price.min}-$
                      {item.price.max}
                      <br />
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
