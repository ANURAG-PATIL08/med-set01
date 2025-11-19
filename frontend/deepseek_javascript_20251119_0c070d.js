import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>MedSet</h3>
            <p>Your comprehensive health and wellness platform designed to help you live a healthier life.</p>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/nutrition">Nutrition</Link></li>
              <li><Link to="/medication">Medication</Link></li>
              <li><Link to="/first-aid">First Aid</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Health Articles</a></li>
              <li><a href="#">Exercise Guides</a></li>
              <li><a href="#">Nutrition Tips</a></li>
              <li><a href="#">First Aid Guide</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <ul>
              <li><a href="mailto:support@medset.com">support@medset.com</a></li>
              <li><a href="tel:+1-800-MED-SET">1-800-MED-SET</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          &copy; 2023 MedSet. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;