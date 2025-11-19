const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['once', 'twice', 'thrice', 'weekly', 'as_needed'],
    required: true
  },
  times: [{
    time: String,
    taken: {
      type: Boolean,
      default: false
    }
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  instructions: String,
  reminders: {
    enabled: {
      type: Boolean,
      default: true
    },
    notification: {
      type: Boolean,
      default: true
    },
    alarm: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Medication', medicationSchema);