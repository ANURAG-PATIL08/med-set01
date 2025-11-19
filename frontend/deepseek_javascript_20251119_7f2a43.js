import React, { useState, useEffect } from 'react';
import { fitnessAPI } from '../services/api';
import HealthAnimation from '../components/HealthAnimation';

const Dashboard = () => {
  const [fitnessData, setFitnessData] = useState({
    steps: 8542,
    calories: 420,
    activeMinutes: 45,
    heartRate: 72
  });

  useEffect(() => {
    fetchFitnessData();
  }, []);

  const fetchFitnessData = async () => {
    try {
      // In a real app, this would fetch from Google Fit API
      // For now, using mock data
      const mockData = {
        steps: 8000 + Math.floor(Math.random() * 2000),
        calories: 400 + Math.floor(Math.random() * 100),
        activeMinutes: 40 + Math.floor(Math.random() * 20),
        heartRate: 70 + Math.floor(Math.random() * 10)
      };
      setFitnessData(mockData);
    } catch (error) {
      console.error('Error fetching fitness data:', error);
    }
  };

  const connectGoogleFit = () => {
    alert('Google Fit integration would be implemented here');
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Health Dashboard</h1>
        
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Steps Today</h3>
            <div className="value">{fitnessData.steps.toLocaleString()}</div>
            <div className="unit">steps</div>
          </div>
          
          <div className="dashboard-card">
            <h3>Calories Burned</h3>
            <div className="value">{fitnessData.calories}</div>
            <div className="unit">kcal</div>
          </div>
          
          <div className="dashboard-card">
            <h3>Active Minutes</h3>
            <div className="value">{fitnessData.activeMinutes}</div>
            <div className="unit">minutes</div>
          </div>
          
          <div className="dashboard-card">
            <h3>Heart Rate</h3>
            <div className="value">{fitnessData.heartRate}</div>
            <div className="unit">bpm</div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="content-left">
            <div className="connect-fitness">
              <h3>Connect Google Fit</h3>
              <p>Sync your fitness data to get personalized insights</p>
              <button onClick={connectGoogleFit} className="btn btn-primary">
                Connect Google Fit
              </button>
            </div>
            
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-grid">
                <button className="action-btn" onClick={() => window.location.href = '/medication'}>
                  <span>💊</span>
                  <span>Medication</span>
                </button>
                <button className="action-btn" onClick={() => window.location.href = '/nutrition'}>
                  <span>🥗</span>
                  <span>Nutrition</span>
                </button>
                <button className="action-btn" onClick={() => window.location.href = '/first-aid'}>
                  <span>🩹</span>
                  <span>First Aid</span>
                </button>
                <button className="action-btn" onClick={() => window.location.href = '/doctors'}>
                  <span>👨‍⚕️</span>
                  <span>Doctors</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="content-right">
            <HealthAnimation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;