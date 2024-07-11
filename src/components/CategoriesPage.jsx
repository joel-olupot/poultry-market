import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import NavBar from './NavBar';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  const groupItemsByCategory = (items) => {
    const groupedItems = {};
    items.forEach((item) => {
      if (!groupedItems[item.name]) {
        groupedItems[item.name] = [];
      }
      groupedItems[item.name].push(item);
    });
    return groupedItems;
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

  const groupedItems = groupItemsByCategory(items);

  return (
    <div>
      <NavBar />
      <Container className="mt-4">
        {Object.keys(groupedItems).map((category, index) => (
          <div key={index} className="category-card mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h4>{category}</h4>
              <div className="view-more">
                <Link to={`/category/${category}`}>➔</Link>
              </div>
            </div>
            <Row>
              {groupedItems[category].map((item) => (
                <Col
                  key={item._id}
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="mb-4 d-flex justify-content-center"
                >
                  <Link to={`/details/${item._id}`} className="card-link w-100">
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
                          <strong>Price:</strong> ${item.price.min}- $
                          {item.price.max}
                          <br />
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default CategoriesPage;
