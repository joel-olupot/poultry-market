import React, { useState, useEffect } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './CartPage.css';
import HomePage from './HomePage';

const CartPage = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [deposit, setDeposit] = useState(null);
  const [consumerProfile, setConsumerProfile] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
  });
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.products);
        if (Array.isArray(response.data.products)) {
          const productsWithImages = response.data.products.map((product) => ({
            ...product,
            imageUrl: arrayBufferToBase64(product.images[0].data.data),
          }));
          setCartProducts(productsWithImages);
        }
      } catch (error) {
        console.error('Error fetching cart products:', error);
      }
    };

    fetchCartProducts();

    const fetchConsumerProfile = async () => {
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setConsumerProfile(response.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConsumerProfile();
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

  const handleRemoveProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedCartProducts = cartProducts.filter(
        (product) => product._id !== productId
      );
      setCartProducts(updatedCartProducts);
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete('http://localhost:3000/api/v1/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartProducts([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const makeOrder = async (deposit) => {
    try {
      const order = {
        products: cartProducts.map((product) => ({
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
        })),
        totalCost: totalAmount,
        deposit: deposit,
      };

      await axios.post('http://localhost:3000/api/v1/order', order, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleClearCart();
      navigate('/account/consumer/history');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const totalAmount = cartProducts.reduce(
    (acc, product) => acc + product.price,
    0
  );

  const config = {
    public_key: 'FLWPUBK_TEST-774024a2cd311149f22f3b036a510e46-X',
    tx_ref: Date.now(),
    amount: deposit,
    currency: 'UGX',
    payment_options: 'mobilemoney',
    customer: {
      email: consumerProfile.email,
      phone_number: consumerProfile.contact,
      name: consumerProfile.name,
    },
    customizations: {
      title: 'CLUCKHUB',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePurchaseClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalContinue = () => {
    setShowModal(false);
    handleFlutterPayment({
      callback: (response) => {
        console.log(response);
        if (response.status === 'successful') {
          makeOrder(response.amount);
        }
        closePaymentModal(); // this will close the modal programmatically
      },
      onClose: () => {},
    });
  };

  return (
    <div>
      {cartProducts.length > 0 ? (
        <div className="container mt-1">
          <div className="row">
            {cartProducts.map((cartProduct) => (
              <div
                key={cartProduct._id}
                className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4 d-flex justify-content-center"
              >
                <div className="card">
                  <img
                    src={cartProduct.imageUrl}
                    className="card-img-top product-image"
                    alt={cartProduct.productId.name}
                  />
                  <div className="card-body">
                    <p className="card-text">
                      <strong className="text-primary fs-5">
                        {cartProduct.name}
                      </strong>
                      <br />
                      Farm:{' '}
                      <strong className="text-primary-emphasis">
                        {cartProduct.farmName}
                      </strong>
                      <br />
                      Quantity:{' '}
                      <strong className="text-primary-emphasis">
                        {cartProduct.quantity}
                      </strong>
                      <br />
                      Price:{' '}
                      <strong className="text-primary-emphasis">
                        {formatter.format(cartProduct.price)}
                      </strong>
                      <br />
                    </p>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveProduct(cartProduct._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4 d-flex justify-content-center">
              <div className="card add-product-card">
                <Link to="/home" className="card-link">
                  <div className="card-body d-flex align-items-center justify-content-center">
                    <h1>+</h1>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {cartProducts.length > 0 && (
            <div>
              <div className="total-amount">
                <strong className="text-primary-emphasis fs-4">
                  Total Amount: {formatter.format(totalAmount)}
                </strong>
              </div>
              <div className="actions d-flex justify-content-center">
                <button
                  className="btn btn-danger mx-2"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
                <button
                  className="btn btn-primary mx-2"
                  onClick={handlePurchaseClick}
                >
                  Purchase
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="text-center fs-3 mt-3">
            <strong className="text-light bg-secondary">
              Your cart is empty.{' '}
              <strong className="text-primary-emphasis bg-light">
                Start shopping now!
              </strong>
            </strong>
          </div>
          <HomePage />
        </div>
      )}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <strong className="text-primary">MAKE A DEPOSIT</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Pay via mobile money</Form.Label>
              <Form.Control
                type="Number"
                placeholder="Enter amount"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalContinue}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CartPage;
