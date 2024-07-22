import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import './OrderHistory.css';
import HomePage from './HomePage';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/order/history',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.detailedOrders);
        if (Array.isArray(response.data.detailedOrders)) {
          const ordersWithImages = response.data.detailedOrders.map(
            (order) => ({
              ...order,
              items: order.items.map((item) => ({
                ...item,
                imageUrl: arrayBufferToBase64(item.images[0].data.data),
              })),
            })
          );
          setOrders(ordersWithImages);
        }
      } catch (error) {
        setError('Ooops... An error occurred, please try again later!');
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

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
      {orders.length > 0 ? (
        <div className="order-history-container">
          {orders.map((order) => (
            <Card key={order._id} className="order-card my-3">
              <Card.Header className="order-card-header">
                <Row className="align-items-center">
                  <Col xs={6}>
                    <div
                      className={`status-badge ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </div>
                  </Col>
                  <Col xs={6} className="text-right">
                    Call:{' '}
                    <strong className="text-primary-emphasis">
                      {order.items[0].contact}
                    </strong>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col>
                    Farm:{' '}
                    <strong className="text-primary-emphasis">
                      {order.items[0].farmName}
                    </strong>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Total Amount:{' '}
                    <strong className="text-primary-emphasis">
                      {formatter.format(order.totalCost.toFixed(2))}
                    </strong>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Deposit:{' '}
                    <strong className="text-primary-emphasis">
                      {formatter.format(order.deposit.toFixed(2))}
                    </strong>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Balance:{' '}
                    <strong className="text-primary-emphasis">
                      {formatter.format(order.balance.toFixed(2))}
                    </strong>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Order Date:{' '}
                    <strong className="text-primary-emphasis">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </strong>
                  </Col>
                </Row>
              </Card.Header>
              <Row className="px-3">
                {order.items.map((item, index) => (
                  <Col md={3} key={index} className="my-2">
                    <Card.Img
                      variant="top"
                      src={item.imageUrl}
                      alt={item.productName}
                      className="order-card-img"
                    />
                    <Card.Body className="p-2 text-center">
                      <strong className="text-primary fs-5">
                        {item.productName}
                      </strong>
                      <Card.Text>
                        Quantity:{' '}
                        <strong className="text-primary-emphasis">
                          {item.quantity}
                        </strong>
                        <br />
                        Price:{' '}
                        <strong className="text-primary-emphasis">
                          {formatter.format(item.price.toFixed(2))}
                        </strong>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                ))}
              </Row>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <div className="text-center fs-3 mt-3">
            <strong className="text-light bg-secondary">
              You haven't made any orders yet.{' '}
              <strong className="text-primary-emphasis bg-light">
                Start shopping now!
              </strong>
            </strong>
          </div>
          <HomePage />
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
