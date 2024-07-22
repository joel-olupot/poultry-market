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
        const response = await axios.get(`http://localhost:3000/api/v1/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
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

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0, // No decimal places
    maximumFractionDigits: 0, // No decimal places
  });

  return (
    <div>
      {orders.length > 0 ? (
        <Container fluid className="px-0 pt-1">
          <h1 className="text-center">Order Management</h1>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Total Amount</th>
                  <th>Amount Paid</th>
                  <th>Balance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr>
                      <td rowSpan={order.items.length}>{order.contact}</td>
                      <td rowSpan={order.items.length}>{order.status}</td>
                      <td>{order.items[0].productName}</td>
                      <td>{order.items[0].quantity}</td>
                      <td>{formatter.format(order.items[0].price)}</td>
                      <td rowSpan={order.items.length}>
                        {formatter.format(order.totalCost)}
                      </td>
                      <td rowSpan={order.items.length}>
                        {formatter.format(order.deposit)}
                      </td>
                      <td rowSpan={order.items.length}>
                        {formatter.format(order.balance)}
                      </td>
                      <td rowSpan={order.items.length}>
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
                    {order.items.slice(1).map((item, index) => (
                      <tr key={`${order._id}-${index}`}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>{formatter.format(item.price)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      ) : (
        <div className="text-center fs-3 mt-3">
          <strong className="text-light bg-secondary">
            You have no orders.{' '}
            <strong className="text-primary-emphasis bg-light">
              Ensure you have stock!
            </strong>
          </strong>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
