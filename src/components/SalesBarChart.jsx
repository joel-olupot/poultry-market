import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesBarChart = () => {
  const [salesData, setSalesData] = useState(Array(7).fill(0));
  const [labels, setLabels] = useState([]);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/orders/sales',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.salesData;
        console.log('Fetched Sales Data:', data); // Debug log
        const today = new Date();
        const daysOfWeek = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        const currentDayIndex = today.getDay();
        const reorderedDays = daysOfWeek
          .slice(currentDayIndex + 1)
          .concat(daysOfWeek.slice(0, currentDayIndex + 1));
        setLabels(reorderedDays);
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Orders',
        data: salesData,
        backgroundColor: '#4CAF50',
      },
    ],
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Orders in the Last 7 Days</Card.Title>
        <Bar data={data} />
      </Card.Body>
    </Card>
  );
};

export default SalesBarChart;
