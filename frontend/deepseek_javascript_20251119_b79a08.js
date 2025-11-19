import React, { useState } from 'react';
import { nutritionAPI } from '../services/api';

const Nutrition = () => {
  const [formData, setFormData] = useState({
    dietType: 'balanced',
    calorieTarget: 2000,
    foodIntolerances: ''
  });
  
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await nutritionAPI.post('/nutrition/diet-plan', {
        dietType: formData.dietType,
        calorieTarget: parseInt(formData.calorieTarget),
        foodIntolerances: formData.foodIntolerances.split(',').map(s => s.trim()).filter(s => s)
      });

      setDietPlan(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate diet plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nutrition-page">
      <div className="container">
        <div className="page-header">
          <h1>Personalized Nutrition</h1>
          <p>Get AI-powered diet plans tailored to your health goals and dietary needs</p>
        </div>

        <div className="form-container">
          <h3>Generate Your Personalized Diet Plan</h3>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="diet-type">Diet Type</label>
                <select 
                  className="form-control" 
                  id="diet-type"
                  name="dietType"
                  value={formData.dietType}
                  onChange={handleChange}
                >
                  <option value="balanced">Balanced</option>
                  <option value="keto">Keto</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="low-carb">Low Carb</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="calorie-target">Calorie Target</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="calorie-target"
                  name="calorieTarget"
                  value={formData.calorieTarget}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="food-intolerances">Food Intolerances (comma separated)</label>
              <input 
                type="text" 
                className="form-control" 
                id="food-intolerances"
                name="foodIntolerances"
                value={formData.foodIntolerances}
                onChange={handleChange}
                placeholder="e.g., gluten, dairy, nuts"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Generating Plan...' : 'Generate Diet Plan'}
            </button>
          </form>
        </div>

        {dietPlan && (
          <div className="form-container">
            <h3>Your Personalized Diet Plan</h3>
            <div className="diet-plan">
              <div className="plan-header">
                <h4>{formData.dietType.charAt(0).toUpperCase() + formData.dietType.slice(1)} Diet Plan</h4>
                <p><strong>Calorie Target:</strong> {dietPlan.calories} calories</p>
                <p><strong>Macros:</strong> {dietPlan.macros.protein} Protein, {dietPlan.macros.carbs} Carbs, {dietPlan.macros.fat} Fat</p>
              </div>
              
              <div className="meal-plan">
                <div className="meal-section">
                  <h5>🍳 Breakfast</h5>
                  <p>{dietPlan.plan.breakfast}</p>
                </div>
                
                <div className="meal-section">
                  <h5>🍽️ Lunch</h5>
                  <p>{dietPlan.plan.lunch}</p>
                </div>
                
                <div className="meal-section">
                  <h5>🍴 Dinner</h5>
                  <p>{dietPlan.plan.dinner}</p>
                </div>
                
                <div className="meal-section">
                  <h5>🥜 Snacks</h5>
                  <ul>
                    {dietPlan.plan.snacks.map((snack, index) => (
                      <li key={index}>{snack}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {dietPlan.intolerancesAvoided.length > 0 && (
                <div className="intolerances-info">
                  <p><strong>Intolerances Avoided:</strong> {dietPlan.intolerancesAvoided.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;