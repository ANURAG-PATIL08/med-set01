#!/usr/bin/env python3
"""
Simplified wound analysis for demo
"""
import sys
import json
from model import analyze_wound

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Image path argument required"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        analysis_result = analyze_wound(image_path)
        print(json.dumps(analysis_result))
        
    except Exception as e:
        print(json.dumps({
            "error": f"Analysis failed: {str(e)}",
            "woundType": "Unknown",
            "severity": "moderate",
            "firstAidSteps": ["Please try again with a clearer image"]
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()