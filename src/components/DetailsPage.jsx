import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import NavBar from './NavBar';
import './DetailsPage.css';
import { useAuth } from './AuthContext';

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
    if (!userType) {
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
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      } catch (error) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    }
  };

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <Card className="item-card">
          {error && (
            <div className="alert alert-danger">Error adding to cart</div>
          )}
          {success && (
            <div className="alert alert-success">
              Item added to cart successfully!
            </div>
          )}
          <Card.Img variant="top" src={item.images[0]} className="item-image" />
          <Card.Body>
            <Card.Text>
              <strong>{item.name}</strong>
              <br />
              <strong>Farm:</strong> {item.farmName}
              <br />
              <strong>Quantity:</strong> {item.quantity.min}-{item.quantity.max}
              <br />
              <strong>Price:</strong> ${item.price.min}-${item.price.max}
              <br />
              <strong>Description:</strong>
              <br /> {item.description}
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
                <strong>Total Price:</strong> ${calculatePrice().toFixed(2)}
              </Card.Text>
              <Button variant="primary" onClick={addToCart}>
                Add to Cart
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default DetailsPage;
