import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    diseases: '',
    dietaryRestrictions: '',
    foodIntolerances: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      age: parseInt(formData.age),
      gender: formData.gender,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      diseases: formData.diseases ? [{ name: formData.diseases }] : [],
      dietaryRestrictions: formData.dietaryRestrictions.split(',').map(s => s.trim()).filter(s => s),
      foodIntolerances: formData.foodIntolerances.split(',').map(s => s.trim()).filter(s => s)
    };

    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Your MedSet Account</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Existing Diseases (if any)</label>
            <input
              type="text"
              name="diseases"
              value={formData.diseases}
              onChange={handleChange}
              placeholder="e.g., Diabetes, Hypertension"
            />
          </div>

          <div className="form-group">
            <label>Dietary Restrictions</label>
            <input
              type="text"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleChange}
              placeholder="e.g., vegetarian, gluten-free (comma separated)"
            />
          </div>

          <div className="form-group">
            <label>Food Intolerances</label>
            <input
              type="text"
              name="foodIntolerances"
              value={formData.foodIntolerances}
              onChange={handleChange}
              placeholder="e.g., lactose, nuts (comma separated)"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;