import React from 'react';
import NavBar from './NavBar';
import './AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div>
      <NavBar />
      <div className="container mt-1">
        <h1 className="text-center">About Us</h1>
        <div className="row">
          <div className="col-12 mb-4">
            <p className="lead">
              Welcome to CluckHub, your trusted platform for connecting farmers
              with buyers of poultry products. We are dedicated to providing
              high-quality poultry and related products, fostering direct and
              transparent relationships between producers and consumers.
            </p>
            <h2>Our Mission</h2>
            <p>
              Our mission is to bridge the gap between farmers and buyers by
              offering a reliable and efficient online marketplace. We aim to
              support local farmers, ensure fair trade practices, and provide
              customers with access to fresh, high-quality poultry products.
            </p>
            <h2>What We Offer</h2>
            <ul>
              <li>
                <strong>Wide Range of Products:</strong> We offer a diverse
                selection of poultry products including hens, ducks, turkeys,
                and eggs, all available in various quantities and price ranges
                to meet the needs of different buyers.
              </li>
              <li>
                <strong>Direct Connection:</strong> Our platform facilitates
                direct transactions between farmers and buyers, ensuring
                transparency and trust in every purchase.
              </li>
              <li>
                <strong>Quality Assurance:</strong> We are committed to ensuring
                the quality and safety of our products. Our farmers adhere to
                the highest standards of animal welfare and farming practices.
              </li>
              <li>
                <strong>Convenience:</strong> Our user-friendly platform makes
                it easy for buyers to browse products, place orders, and manage
                their purchases, all from the comfort of their homes.
              </li>
            </ul>
            <h2>Our Story</h2>
            <p>
              CluckHub was founded with the vision of transforming the poultry
              market by leveraging technology to create a seamless and
              transparent buying experience. We started as a small team of
              dedicated individuals passionate about supporting local farmers
              and providing customers with access to fresh, high-quality poultry
              products.
            </p>
            <p>
              Over the years, we have grown into a trusted platform that serves
              numerous farmers and buyers across the region. Our commitment to
              quality, transparency, and customer satisfaction has been the
              driving force behind our success.
            </p>
            <h2>Meet Our Team</h2>
            <p>
              Our team is composed of experienced professionals from various
              backgrounds, including agriculture, technology, and business.
              Together, we work tirelessly to ensure that CluckHub remains the
              preferred choice for poultry buyers and farmers alike.
            </p>
            <h2>Contact Us</h2>
            <p>
              We are always here to assist you. If you have any questions,
              concerns, or feedback, please feel free to reach out to us. You
              can contact us via email at{' '}
              <a href="mailto:support@cluckhub.com">support@cluckhub.com</a> or
              call us at 0800-123-456.
            </p>
            <p>
              Thank you for choosing CluckHub. We look forward to serving you!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
