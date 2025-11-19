import json
import random
import sys

def analyze_wound(image_path):
    """Mock wound analysis function for demo purposes"""
    # Simulate different wound types and severities
    wound_types = ['Abrasion', 'Laceration', 'Puncture', 'Burn', 'Bruise', 'Ulcer']
    severities = ['minor', 'moderate', 'severe']
    
    wound_type = random.choice(wound_types)
    severity = random.choice(severities)
    
    # Mock analysis results
    analysis = {
        "woundType": wound_type,
        "severity": severity,
        "description": f"This appears to be a {severity} {wound_type.lower()}. Analysis based on visual characteristics.",
        "firstAidSteps": [
            "Clean the wound with mild soap and water",
            "Apply antibiotic ointment if available",
            "Cover with sterile bandage",
            "Monitor for signs of infection",
            "Change dressing regularly"
        ],
        "immediateActions": [
            "Stop any bleeding with direct pressure",
            "Clean the wound area gently",
            "Keep the wound elevated if possible"
        ],
        "recommendations": [
            "Keep wound clean and dry",
            "Monitor for redness, swelling, or pus",
            "Seek medical attention if condition worsens"
        ],
        "emergency": severity == "severe",
        "professionalHelpNeeded": severity in ["moderate", "severe"],
        "confidence": round(random.uniform(0.7, 0.95), 2)
    }
    
    return analysis

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Image path required"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = analyze_wound(image_path)
    print(json.dumps(result))