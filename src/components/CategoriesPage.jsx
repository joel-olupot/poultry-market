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

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0, // No decimal places
    maximumFractionDigits: 0, // No decimal places
  });

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
    <div className="container my-1">
      {Object.keys(groupedItems).map((category, index) => (
        <div key={index} className="category-card mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4>{category}</h4>
            <div className="view-more">
              <Link to={`/category/${category}`}>➔</Link>
            </div>
          </div>
          <div className="row">
            {groupedItems[category].map((item) => (
              <div key={item._id} className="col-lg-3 col-md-6 col-sm-12 mb-4">
                <Link to={`/details/${item._id}`} className="card-link w-100">
                  <div className="card">
                    <img
                      variant="top"
                      src={item.imageUrl}
                      className="item-image"
                      alt={item.name}
                    />
                    <div className="card-body">
                      <h5 className="card-text fs-5 text-primary">
                        {item.name}
                      </h5>
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
      ))}
    </div>
  );
};

export default CategoriesPage;
