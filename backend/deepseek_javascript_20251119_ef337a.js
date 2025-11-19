const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const auth = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/wounds';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'wound-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Mock wound analysis (since we don't have the actual Python VLM running)
router.post('/analyze', auth, upload.single('woundImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Simulate VLM analysis with mock data
    const analysisResult = await simulateVlmAnalysis(req.file);
    
    res.json({
      success: true,
      analysis: analysisResult,
      imageUrl: `/uploads/wounds/${path.basename(req.file.path)}`
    });
    
  } catch (error) {
    console.error('Wound analysis error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to analyze wound image',
      error: error.message 
    });
  }
});

// Mock VLM analysis function
async function simulateVlmAnalysis(file) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const woundTypes = ['Abrasion', 'Laceration', 'Puncture', 'Burn', 'Bruise'];
  const severities = ['minor', 'moderate', 'severe'];
  const selectedType = woundTypes[Math.floor(Math.random() * woundTypes.length)];
  const selectedSeverity = severities[Math.floor(Math.random() * severities.length)];
  
  const firstAidTips = {
    'Abrasion': [
      'Wash hands thoroughly before treatment',
      'Gently clean the area with mild soap and warm water',
      'Apply antibiotic ointment to prevent infection',
      'Cover with a sterile non-stick bandage',
      'Change dressing daily or when soiled'
    ],
    'Laceration': [
      'Apply direct pressure with clean cloth to stop bleeding',
      'Clean wound with saline solution or clean water',
      'Apply antibiotic ointment',
      'Close wound with butterfly bandages if edges gap',
      'Cover with sterile dressing'
    ],
    'Puncture': [
      'Allow wound to bleed gently to clean itself',
      'Clean with soap and warm water for 5-10 minutes',
      'Apply antibiotic ointment',
      'Cover with clean bandage',
      'Monitor closely for signs of infection'
    ],
    'Burn': [
      'Cool burn under running water for 10-15 minutes',
      'Gently pat dry with clean cloth',
      'Apply burn cream or aloe vera gel',
      'Cover with non-stick sterile dressing',
      'Take over-the-counter pain relief if needed'
    ],
    'Bruise': [
      'Apply ice pack for 15-20 minutes',
      'Elevate injured area if possible',
      'Rest the affected area',
      'Apply arnica gel or cream',
      'Monitor for increased swelling or pain'
    ]
  };

  return {
    woundType: selectedType,
    severity: selectedSeverity,
    description: `This appears to be a ${selectedSeverity} ${selectedType.toLowerCase()}. ${getDescriptionByType(selectedType, selectedSeverity)}`,
    firstAidSteps: firstAidTips[selectedType] || firstAidTips['Abrasion'],
    immediateActions: [
      'Stop any bleeding with direct pressure',
      'Clean the wound area gently',
      'Keep the wound elevated if possible'
    ],
    recommendations: [
      'Monitor for signs of infection (redness, swelling, pus)',
      'Keep wound clean and dry',
      'Change dressing regularly',
      selectedSeverity === 'severe' ? 'Seek medical attention within 24 hours' : 'Monitor healing progress'
    ],
    emergency: selectedSeverity === 'severe',
    professionalHelpNeeded: selectedSeverity === 'severe',
    confidence: (0.7 + Math.random() * 0.25).toFixed(2)
  };
}

function getDescriptionByType(type, severity) {
  const descriptions = {
    'Abrasion': `A ${severity} surface wound where the skin has been scraped. Common in falls and accidents.`,
    'Laceration': `A ${severity} cut or tear in the skin. May require medical attention if deep.`,
    'Puncture': `A ${severity} wound caused by a pointed object. High risk of infection.`,
    'Burn': `A ${severity} injury caused by heat, chemicals, or electricity. Requires careful treatment.`,
    'Bruise': `A ${severity} contusion where blood vessels are damaged under the skin.`
  };
  return descriptions[type] || 'This wound requires proper medical assessment.';
}

module.exports = router;