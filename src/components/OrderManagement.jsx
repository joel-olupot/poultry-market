import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';
import axios from 'axios';
import './OrderManagement.css';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/order', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.detailedOrders);
        setOrders(response.data.detailedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleCheckboxToggle = async (orderId) => {
    try {
      const order = orders.find((order) => order._id === orderId);
      const updatedStatus =
        order.status === 'pending' ? 'completed' : 'pending';
      await axios.patch(
        `http://localhost:3000/api/v1/order/${orderId}`,
        {
          status: updatedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: updatedStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/order/${orderId}`,
        {
          status: 'rejected',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrders = orders.map((order) =>
        order._id === orderId && order.status === 'pending'
          ? { ...order, status: 'rejected' }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  return (
    <Container fluid className="px-0 pt-1">
      <h1 className="text-center">Order Management</h1>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order Id</th>
              <th>Status</th>
              <th>Poultry Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Amount Paid</th>
              <th>Balance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.status}</td>
                <td>{order.name}</td>
                <td>{order.quantity}</td>
                <td>${order.price}</td>
                <td>$0</td>
                <td>${order.price}</td>
                <td>
                  {order.status === 'pending' && (
                    <Form.Check
                      type="checkbox"
                      label="Complete"
                      checked={order.status === 'completed'}
                      onChange={() => handleCheckboxToggle(order._id)}
                    />
                  )}{' '}
                  {order.status === 'pending' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default OrderManagementPage;
