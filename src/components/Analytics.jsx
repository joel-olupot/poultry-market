import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import TotalOrders from './TotalOrders';
import OrderStatusPieChart from './OrderStatusPieChart';
import SalesBarChart from './SalesBarChart';
import './Analytics.css';

const Analytics = () => {
  return (
    <Container fluid className="px-3 py-4">
      <h1 className="text-center mb-4">Analytics</h1>
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm p-3">
            <TotalOrders />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="mb-4">
          <OrderStatusPieChart />
        </Col>
        <Col md={8} className="mb-4">
          <SalesBarChart />
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;
