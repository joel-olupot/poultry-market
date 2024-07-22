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

        console.log(response);
        setOrdersToday(response.data.ordersToday);
        console.log(response.data.ordersYesterday);
        setOrdersYesterday(response.data.ordersYesterday);
        console.log(response.data.ordersLast7Days);
        setOrdersLast7Days(response.data.ordersLast7Days);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="total-orders-container">
      <Row className="justify-content-around text-center mt-3 my-3">
        <Col md={3}>
          <Card className="bg-light text-dark">
            <Card.Body>
              <Card.Title>Orders Today</Card.Title>
              <p>{ordersToday}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-secondary text-white">
            <Card.Body>
              <Card.Title>Orders Yesterday</Card.Title>
              <p>{ordersYesterday}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-info text-dark">
            <Card.Body>
              <Card.Title>Orders in Last 7 Days</Card.Title>
              <p>{ordersLast7Days}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TotalOrders;
