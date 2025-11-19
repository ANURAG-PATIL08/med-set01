const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Generate diet plan
router.post('/diet-plan', auth, async (req, res) => {
  try {
    const { dietType, calorieTarget, foodIntolerances } = req.body;
    
    const dietPlan = generateMockDietPlan(dietType, calorieTarget, foodIntolerances);
    
    res.json(dietPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function generateMockDietPlan(dietType, calorieTarget, intolerances) {
  const plans = {
    balanced: {
      breakfast: "Oatmeal with fruits and nuts (300 calories)",
      lunch: "Grilled chicken with quinoa and vegetables (600 calories)",
      dinner: "Salmon with sweet potato and broccoli (500 calories)",
      snacks: ["Greek yogurt (150 calories)", "Apple with peanut butter (200 calories)"]
    },
    keto: {
      breakfast: "Eggs with avocado and bacon (400 calories)",
      lunch: "Caesar salad with grilled chicken (no croutons) (550 calories)",
      dinner: "Steak with asparagus and butter (600 calories)",
      snacks: ["Cheese slices (200 calories)", "Almonds (150 calories)"]
    },
    vegetarian: {
      breakfast: "Smoothie bowl with plant-based protein (350 calories)",
      lunch: "Lentil soup with whole grain bread (500 calories)",
      dinner: "Vegetable stir-fry with tofu (550 calories)",
      snacks: ["Hummus with vegetables (180 calories)", "Trail mix (220 calories)"]
    },
    vegan: {
      breakfast: "Chia seed pudding with berries (300 calories)",
      lunch: "Quinoa salad with chickpeas and tahini (500 calories)",
      dinner: "Lentil curry with brown rice (550 calories)",
      snacks: ["Roasted edamame (150 calories)", "Fruit salad (200 calories)"]
    }
  };

  return {
    plan: plans[dietType] || plans.balanced,
    calories: calorieTarget,
    macros: {
      protein: `${Math.round(calorieTarget * 0.3 / 4)}g`,
      carbs: `${Math.round(calorieTarget * 0.4 / 4)}g`,
      fat: `${Math.round(calorieTarget * 0.3 / 9)}g`
    },
    intolerancesAvoided: intolerances || [],
    generatedAt: new Date().toISOString()
  };
}

module.exports = router;