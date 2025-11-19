import React, { useState, useEffect } from 'react';
import { medicationAPI } from '../services/api';

const Medication = () => {
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once',
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await medicationAPI.get('/medication');
      setMedications(response.data);
    } catch (err) {
      setError('Failed to fetch medications');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({
      ...formData,
      times: newTimes
    });
  };

  const addTime = () => {
    setFormData({
      ...formData,
      times: [...formData.times, '08:00']
    });
  };

  const removeTime = (index) => {
    const newTimes = formData.times.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      times: newTimes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await medicationAPI.post('/medication', formData);
      setFormData({
        name: '',
        dosage: '',
        frequency: 'once',
        times: ['08:00'],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        instructions: ''
      });
      fetchMedications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  const markAsTaken = async (medicationId, timeIndex) => {
    try {
      await medicationAPI.patch(`/medication/${medicationId}/taken`, { timeIndex });
      fetchMedications();
    } catch (err) {
      setError('Failed to update medication');
    }
  };

  const deleteMedication = async (medicationId) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await medicationAPI.delete(`/medication/${medicationId}`);
        fetchMedications();
      } catch (err) {
        setError('Failed to delete medication');
      }
    }
  };

  return (
    <div className="medication-page">
      <div className="container">
        <div className="page-header">
          <h1>Medication Management</h1>
          <p>Set reminders for your medications and never miss a dose</p>
        </div>

        <div className="form-container">
          <h3>Add New Medication</h3>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Medication Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Aspirin"
                  required
                />
              </div>
              <div className="form-group">
                <label>Dosage</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder="e.g., 500mg"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Frequency</label>
                <select name="frequency" value={formData.frequency} onChange={handleChange} required>
                  <option value="once">Once a day</option>
                  <option value="twice">Twice a day</option>
                  <option value="thrice">Three times a day</option>
                  <option value="weekly">Weekly</option>
                  <option value="as_needed">As needed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Reminder Times</label>
              {formData.times.map((time, index) => (
                <div key={index} className="time-input-group">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    required
                  />
                  {formData.times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTime(index)}
                      className="btn btn-outline"
                      style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTime}
                className="btn btn-outline"
                style={{ marginTop: '0.5rem' }}
              >
                Add Another Time
              </button>
            </div>

            <div className="form-group">
              <label>Instructions (Optional)</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Special instructions for taking this medication..."
                rows="3"
                className="form-control"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Adding Medication...' : 'Add Medication'}
            </button>
          </form>
        </div>

        <div className="form-container">
          <h3>Current Medications</h3>
          <div className="medication-list">
            {medications.length === 0 ? (
              <p>No medications added yet.</p>
            ) : (
              medications.map((medication) => (
                <div key={medication._id} className="medication-item">
                  <div className="medication-info">
                    <h4>{medication.name}</h4>
                    <p><strong>Dosage:</strong> {medication.dosage}</p>
                    <p><strong>Frequency:</strong> {medication.frequency}</p>
                    <p><strong>Times:</strong> {medication.times.map(t => t.time).join(', ')}</p>
                    {medication.instructions && (
                      <p><strong>Instructions:</strong> {medication.instructions}</p>
                    )}
                  </div>
                  <div className="medication-actions">
                    {medication.times.map((timeSlot, index) => (
                      <button
                        key={index}
                        onClick={() => markAsTaken(medication._id, index)}
                        disabled={timeSlot.taken}
                        className={`btn ${timeSlot.taken ? 'btn-outline' : 'btn-primary'}`}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        {timeSlot.taken ? 'Taken' : 'Mark Taken'} at {timeSlot.time}
                      </button>
                    ))}
                    <button
                      onClick={() => deleteMedication(medication._id)}
                      className="btn btn-outline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medication;