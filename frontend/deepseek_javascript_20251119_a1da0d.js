import React, { useState, useEffect } from 'react';
import { doctorsAPI } from '../services/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filters, setFilters] = useState({
    specialty: 'all',
    location: '',
    consultationType: 'both'
  });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, filters]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorsAPI.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (filters.specialty !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }

    if (filters.consultationType !== 'both') {
      filtered = filtered.filter(doctor =>
        doctor.consultationTypes.includes(filters.consultationType)
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleBookAppointment = (doctor) => {
    setBooking(doctor);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const response = await doctorsAPI.post('/doctors/appointments', {
        doctorId: booking.id,
        date: formData.get('date'),
        time: formData.get('time'),
        consultationType: formData.get('consultationType'),
        notes: formData.get('notes')
      });

      if (response.data.success) {
        alert('Appointment booked successfully!');
        setBooking(null);
      }
    } catch (error) {
      alert('Failed to book appointment. Please try again.');
    }
  };

  if (loading) {
    return <div className="container">Loading doctors...</div>;
  }

  return (
    <div className="doctors-page">
      <div className="container">
        <div className="page-header">
          <h1>Find a Doctor</h1>
          <p>Book online or in-person consultations with healthcare professionals</p>
        </div>

        <div className="form-container">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="specialty">Specialty</label>
              <select 
                className="form-control" 
                id="specialty"
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
              >
                <option value="all">All Specialties</option>
                <option value="general">General Practitioner</option>
                <option value="cardiology">Cardiology</option>
                <option value="dermatology">Dermatology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="pediatrics">Pediatrics</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="consultation-type">Consultation Type</label>
              <select 
                className="form-control" 
                id="consultation-type"
                name="consultationType"
                value={filters.consultationType}
                onChange={handleFilterChange}
              >
                <option value="both">Online or In-person</option>
                <option value="online">Online Only</option>
                <option value="in-person">In-person Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="doctors-grid">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-image">
                {doctor.image ? (
                  <img src={doctor.image} alt={doctor.name} />
                ) : (
                  <span>👨‍⚕️</span>
                )}
              </div>
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.specialty}</p>
                <div className="doctor-rating">
                  <span>⭐ {doctor.rating}</span>
                  <span>({doctor.reviews} reviews)</span>
                </div>
                <div className="doctor-availability">
                  {doctor.available ? (
                    <span className="available">● Available</span>
                  ) : (
                    <span className="not-available">● Not Available</span>
                  )}
                  <span>📍 {doctor.distance}</span>
                </div>
                <div className="consultation-types">
                  {doctor.consultationTypes.map(type => (
                    <span key={type} className="consultation-badge">
                      {type === 'online' ? '💻 Online' : '🏥 In-person'}
                    </span>
                  ))}
                </div>
                <p><strong>Next Available:</strong> {doctor.nextAvailable}</p>
                <button 
                  onClick={() => handleBookAppointment(doctor)}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem' }}
                  disabled={!doctor.available}
                >
                  {doctor.available ? 'Book Appointment' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="form-container">
            <p style={{ textAlign: 'center' }}>No doctors found matching your criteria.</p>
          </div>
        )}

        {booking && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Book Appointment with {booking.name}</h3>
                <button onClick={() => setBooking(null)} className="close-btn">×</button>
              </div>
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" name="date" required className="form-control" />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" name="time" required className="form-control" />
                </div>
                <div className="form-group">
                  <label>Consultation Type</label>
                  <select name="consultationType" required className="form-control">
                    {booking.consultationTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'online' ? 'Online Consultation' : 'In-person Visit'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea 
                    name="notes" 
                    placeholder="Describe your symptoms or concerns..."
                    rows="3"
                    className="form-control"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setBooking(null)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6c757d;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default Doctors;