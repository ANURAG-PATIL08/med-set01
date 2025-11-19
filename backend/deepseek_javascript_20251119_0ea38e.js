const express = require('express');
const auth = require('../middleware/auth');
const Medication = require('../models/Medication');
const router = express.Router();

// Add medication
router.post('/', auth, async (req, res) => {
  try {
    const { name, dosage, frequency, times, startDate, endDate, instructions } = req.body;
    
    const medication = new Medication({
      userId: req.userId,
      name,
      dosage,
      frequency,
      times: times.map(t => ({ time: t })),
      startDate,
      endDate,
      instructions
    });

    await medication.save();
    
    res.status(201).json(medication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user medications
router.get('/', auth, async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.userId });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark medication as taken
router.patch('/:id/taken', auth, async (req, res) => {
  try {
    const { timeIndex } = req.body;
    const medication = await Medication.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    if (timeIndex >= 0 && timeIndex < medication.times.length) {
      medication.times[timeIndex].taken = true;
      await medication.save();
    }

    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete medication
router.delete('/:id', auth, async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;