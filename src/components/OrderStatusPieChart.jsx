import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatusPieChart = () => {
  const [statusData, setStatusData] = useState({
    pending: 0,
    completed: 0,
    rejected: 0,
  });
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrderStatusData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/orders/status',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStatusData(response.data.statusData);
      } catch (error) {
        console.error('Error fetching order status data:', error);
      }
    };

    fetchOrderStatusData();
  }, [token]);

  const handleCheckboxChange = (e) => {
    const status = e.target.dataset.status;
    setStatusData((prevState) => ({
      ...prevState,
      [status]: e.target.checked ? prevState[status] : 0,
    }));
  };

  const data = {
    labels: ['Pending', 'Completed', 'Rejected'],
    datasets: [
      {
        data: [statusData.pending, statusData.completed, statusData.rejected],
        backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Order Status</Card.Title>
        <Form>
          <Form.Check
            type="checkbox"
            label="Pending"
            data-status="pending"
            defaultChecked
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Completed"
            data-status="completed"
            defaultChecked
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Rejected"
            data-status="rejected"
            defaultChecked
            onChange={handleCheckboxChange}
          />
        </Form>
        <Pie data={data} />
      </Card.Body>
    </Card>
  );
};

export default OrderStatusPieChart;
