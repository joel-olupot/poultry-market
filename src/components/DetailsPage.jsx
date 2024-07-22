import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './DetailsPage.css';
import { useAuth } from './AuthContext';
import HomePage from './HomePage';

const DetailsPage = () => {
  const { id } = useParams();
  const { userType } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/items/${id}`
        );
        const itemWithImage = {
          ...response.data.item,
          images: response.data.item.images.map((image) =>
            arrayBufferToBase64(image.data.data)
          ),
        };
        console.log(itemWithImage);
        setItem(itemWithImage);
        setSelectedQuantity(itemWithImage.quantity.min);
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    fetchItemDetails();
  }, [id]);

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

  const handleQuantityChange = (event) => {
    setSelectedQuantity(parseInt(event.target.value));
  };

  const calculatePrice = () => {
    if (!item) return 0;
    const { min, max } = item.quantity;
    const { min: minPrice, max: maxPrice } = item.price;

    const priceRange = maxPrice - minPrice;
    const quantityRange = max - min;
    const pricePerUnit = priceRange / quantityRange;
    const totalPrice = minPrice + (selectedQuantity - min) * pricePerUnit;

    return totalPrice;
  };

  if (!item) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only"></span>
        </Spinner>
      </div>
    );
  }

  const addToCart = async () => {
    if (userType !== 'consumer') {
      navigate('/login');
    } else {
      try {
        const token = localStorage.getItem('authToken');
        const totalPrice = calculatePrice().toFixed(2);

        const response = await axios.post(
          'http://localhost:3000/api/v1/cart',
          {
            productId: id,
            quantity: selectedQuantity,
            price: totalPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        if (response.data.status === 'unsuccessful') {
          setError(
            'Only items from the same farm can be added to the same cart!'
          );
          setTimeout(() => {
            setError(false);
          }, 3000);
        }
        if (!response.data.status) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 2000);
        }
      } catch (error) {
        setError(error.message);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    }
  };

  return (
    <>
      <Container className="mt-2 bg-secondary-emphasis border-bold">
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {success && (
          <div className="alert alert-success text-center">
            Item added to cart successfully!
          </div>
        )}
        <Card className="item-card">
          <Card.Img variant="top" src={item.images[0]} className="item-image" />
          <Card.Body>
            <Card.Text>
              <strong className="text-primary fs-5">{item.name}</strong>
              <br />
              Farm:{' '}
              <strong className="text-primary-emphasis">{item.farmName}</strong>
              <br />
              Quantity:{' '}
              <strong className="text-primary-emphasis">
                {item.quantity.min} - {item.quantity.max}
              </strong>
              <br />
              Unit Price:{' '}
              <strong className="text-primary-emphasis">
                {formatter.format(item.price.min / item.quantity.min)}
              </strong>
              <br />
              Price:{' '}
              <strong className="text-primary-emphasis">
                {formatter.format(item.price.min)} -{' '}
                {formatter.format(item.price.max)}
              </strong>
              <br />
              Description:
              <br />{' '}
              <strong className="text-primary-emphasis">
                {item.description}
              </strong>
              <br />
            </Card.Text>
            <Form>
              <Form.Group controlId="quantitySelect">
                <Form.Label>Select Quantity:</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedQuantity}
                  onChange={handleQuantityChange}
                >
                  {Array.from(
                    { length: item.quantity.max - item.quantity.min + 1 },
                    (_, index) => (
                      <option key={index} value={item.quantity.min + index}>
                        {item.quantity.min + index}
                      </option>
                    )
                  )}
                </Form.Control>
              </Form.Group>
              <Card.Text>
                Total Price:{' '}
                <strong>{formatter.format(calculatePrice().toFixed(2))}</strong>
              </Card.Text>
              <Button variant="primary" onClick={addToCart}>
                Add to Cart
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <br />
      <div className="text-center fs-1">
        <strong className="text-light bg-secondary">
          You may also like the following products.{' '}
          <strong className="text-primary-emphasis bg-light">
            Let's explore to find your favorites!
          </strong>
        </strong>
      </div>
      <HomePage />
    </>
  );
};

export default DetailsPage;
