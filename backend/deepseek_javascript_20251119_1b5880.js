const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Get doctors list
router.get('/', auth, async (req, res) => {
  try {
    const { specialty, location } = req.query;
    
    // Mock doctors data
    const doctors = [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "General Practitioner",
        rating: 4.8,
        reviews: 124,
        distance: "2.3 miles",
        available: true,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=200&fit=crop",
        consultationTypes: ["online", "in-person"],
        nextAvailable: "Today, 2:00 PM"
      },
      {
        id: 2,
        name: "Dr. Michael Chen",
        specialty: "Cardiologist",
        rating: 4.9,
        reviews: 98,
        distance: "3.1 miles",
        available: true,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=200&fit=crop",
        consultationTypes: ["in-person"],
        nextAvailable: "Tomorrow, 10:00 AM"
      },
      {
        id: 3,
        name: "Dr. Emily Rodriguez",
        specialty: "Dermatologist",
        rating: 4.7,
        reviews: 156,
        distance: "1.8 miles",
        available: false,
        image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=300&h=200&fit=crop",
        consultationTypes: ["online", "in-person"],
        nextAvailable: "Monday, 9:00 AM"
      },
      {
        id: 4,
        name: "Dr. James Wilson",
        specialty: "Orthopedist",
        rating: 4.6,
        reviews: 87,
        distance: "4.2 miles",
        available: true,
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop",
        consultationTypes: ["in-person"],
        nextAvailable: "Today, 4:30 PM"
      }
    ];

    // Filter doctors based on query parameters
    let filteredDoctors = doctors;
    
    if (specialty && specialty !== 'all') {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }

    res.json(filteredDoctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book appointment
router.post('/appointments', auth, async (req, res) => {
  try {
    const { doctorId, date, time, consultationType, notes } = req.body;
    
    // Mock appointment booking
    const appointment = {
      id: Date.now(),
      doctorId,
      userId: req.userId,
      date,
      time,
      consultationType,
      notes,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      appointment,
      message: 'Appointment booked successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;