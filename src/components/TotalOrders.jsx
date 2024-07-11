import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './TotalOrders.css'; // Import custom CSS for styling

const TotalOrders = () => {
  const [ordersToday, setOrdersToday] = useState(0);
  const [ordersYesterday, setOrdersYesterday] = useState(0);
  const [ordersLast7Days, setOrdersLast7Days] = useState(0);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/orders/summary',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrdersToday(response.data.ordersToday);
        setOrdersYesterday(response.data.ordersYesterday);
        setOrdersLast7Days(response.data.ordersLast7Days);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="total-orders-container">
      <h4 className="text-center">Order count</h4>
      <Row className="justify-content-around text-center">
        <Col md={3}>
          <Card className="bg-light text-dark">
            <Card.Body>
              <Card.Title>Today</Card.Title>
              <p>{ordersToday}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-secondary text-white">
            <Card.Body>
              <Card.Title>Yesterday</Card.Title>
              <p>{ordersYesterday}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-info text-dark">
            <Card.Body>
              <Card.Title>Last 7 Days</Card.Title>
              <p>{ordersLast7Days}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TotalOrders;
