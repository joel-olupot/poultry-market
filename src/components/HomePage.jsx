import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
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
    <div className="container my-1">
      <div className="row">
        {items.map((item) => (
          <div key={item._id} className="col-lg-3 col-md-6 col-sm-12 mb-4">
            <Link
              to={{ pathname: `/details/${item._id}`, state: { item } }}
              className="card-link w-100"
            >
              <div className="card">
                <img
                  variant="top"
                  src={item.imageUrl}
                  className="item-image"
                  alt={item.name}
                />
                <div className="card-body">
                  <h5 className="card-text fs-5 text-primary">{item.name}</h5>
                  <div className="card-text">
                    Farm:
                    <strong className="text-primary-emphasis">
                      {item.farmName}
                    </strong>
                  </div>
                  <div className="card-text">
                    Quantity Range:{' '}
                    <strong className="text-primary-emphasis">
                      {item.quantity.min}-{item.quantity.max}
                    </strong>
                  </div>
                  <div className="card-text">
                    Unit Price:{' '}
                    <strong className="text-primary-emphasis">
                      {formatter.format(item.price.min / item.quantity.min)}
                    </strong>
                    <br />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
