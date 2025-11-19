import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">⚕️</span>
            <span>MedSet</span>
          </Link>
          
          <nav>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/nutrition">Nutrition</Link></li>
              <li><Link to="/medication">Medication</Link></li>
              <li><Link to="/first-aid">First Aid</Link></li>
              <li><Link to="/doctors">Doctors</Link></li>
            </ul>
          </nav>
          
          <div className="user-actions">
            {currentUser ? (
              <>
                <span>Welcome, {currentUser.username}</span>
                <button className="btn btn-outline" onClick={handleLogout}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Sign In</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;