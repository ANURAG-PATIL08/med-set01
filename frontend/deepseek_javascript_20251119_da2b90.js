import React from 'react';
import { Link } from 'react-router-dom';
import HealthAnimation from '../components/HealthAnimation';

const Home = () => {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Your Personal Health & Wellness Assistant</h1>
              <p>MedSet integrates fitness tracking, nutrition planning, medication management, and medical consultations in one comprehensive platform.</p>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
            <div className="hero-animation">
              <HealthAnimation />
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>Comprehensive Health Features</h2>
            <p>MedSet offers a complete suite of tools to manage your health and wellness journey</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏃‍♂️</div>
              <h3>Fitness Tracking</h3>
              <p>Connect with Google Fit to track your daily activities, steps, calories burned, and more.</p>
              <button className="btn btn-primary">Connect Google Fit</button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🥗</div>
              <h3>Personalized Nutrition</h3>
              <p>Get AI-powered diet plans tailored to your health goals, dietary restrictions, and food intolerances.</p>
              <Link to="/nutrition" className="btn btn-primary">Generate Diet Plan</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Medication Management</h3>
              <p>Set reminders for your medications with alarms and notifications to ensure you never miss a dose.</p>
              <Link to="/medication" className="btn btn-primary">Set Reminders</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🩹</div>
              <h3>First Aid Assistant</h3>
              <p>Upload a picture of a wound and get AI-powered first aid recommendations.</p>
              <Link to="/first-aid" className="btn btn-primary">Analyze Wound</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Doctor Consultations</h3>
              <p>Book online or in-person appointments with doctors near your location.</p>
              <Link to="/doctors" className="btn btn-primary">Find Doctors</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Health Analytics</h3>
              <p>Track your progress with detailed analytics and insights into your health metrics.</p>
              <Link to="/dashboard" className="btn btn-primary">View Analytics</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;