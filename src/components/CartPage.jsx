import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import './CartPage.css';

const CartPage = () => {
  const [cartProducts, setCartProducts] = useState([]);
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
  const makeOrder = async () => {
    try {
      const promises = cartProducts.map((product) =>
        axios.post(
          'http://localhost:3000/api/v1/order',
          {
            productId: product.productId,
            quantity: product.quantity,
            price: product.price,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );

      await Promise.all(promises);
      handleClearCart();
      setCartProducts([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const totalAmount = cartProducts.reduce(
    (acc, product) => acc + product.price,
    0
  );

  return (
    <div>
      <NavBar />
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
                    {cartProduct.name}
                    <br />
                    <strong>Farm:</strong> {cartProduct.farmName}
                    <br />
                    <strong>Quantity:</strong> {cartProduct.quantity}
                    <br />
                    <strong>Price:</strong> ${cartProduct.price}
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
              <h4>Total Amount: ${totalAmount}</h4>
            </div>
            <div className="actions d-flex justify-content-center">
              <button className="btn btn-danger mx-2" onClick={handleClearCart}>
                Clear Cart
              </button>
              <button className="btn btn-primary mx-2" onClick={makeOrder}>
                Purchase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
