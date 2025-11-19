import React, { useState, useRef } from 'react';
import { firstAidAPI } from '../services/api';

const FirstAid = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('woundImage', selectedImage);

    try {
      const response = await firstAidAPI.post('/firstaid/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setAnalysis(response.data.analysis);
      } else {
        setError(response.data.message || 'Analysis failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      minor: 'var(--success)',
      moderate: 'var(--warning)',
      severe: 'var(--danger)',
      critical: '#dc3545'
    };
    return colors[severity?.toLowerCase()] || colors.moderate;
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="first-aid-page">
      <div className="container">
        <div className="page-header">
          <h1>First Aid Assistant</h1>
          <p>Upload a picture of a wound for AI-powered first aid recommendations</p>
        </div>

        <div className="first-aid-content">
          <div className="upload-section">
            <div 
              className={`upload-area ${previewUrl ? 'has-image' : ''}`}
              onClick={triggerFileSelect}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
              
              {previewUrl ? (
                <div className="image-preview">
                  <img src={previewUrl} alt="Wound preview" />
                  <div className="image-overlay">
                    <span>Click to change image</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="upload-icon">📷</div>
                  <p>Click to upload a picture of your wound</p>
                  <small>Supported formats: JPG, PNG, WebP (Max 10MB)</small>
                </>
              )}
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={!selectedImage || loading}
              className="btn btn-primary analyze-btn"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Analyzing...
                </>
              ) : (
                'Analyze Wound'
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {analysis && (
            <div className="analysis-results">
              <div className="results-header">
                <h2>Analysis Results</h2>
                <div 
                  className="severity-badge"
                  style={{ backgroundColor: getSeverityColor(analysis.severity) }}
                >
                  {analysis.severity} Severity
                </div>
                {analysis.emergency && (
                  <div className="emergency-alert">
                    🚨 Emergency - Seek Immediate Medical Attention
                  </div>
                )}
              </div>

              <div className="results-grid">
                <div className="result-card">
                  <h3>Wound Type</h3>
                  <div className="result-value">{analysis.woundType}</div>
                </div>

                <div className="result-card">
                  <h3>Severity Level</h3>
                  <div 
                    className="result-value severity"
                    style={{ color: getSeverityColor(analysis.severity) }}
                  >
                    {analysis.severity}
                  </div>
                </div>

                <div className="result-card">
                  <h3>Confidence</h3>
                  <div className="result-value">
                    {Math.round(analysis.confidence * 100)}%
                  </div>
                </div>

                <div className="result-card full-width">
                  <h3>Description</h3>
                  <div className="result-value description">
                    {analysis.description}
                  </div>
                </div>
              </div>

              <div className="first-aid-instructions">
                <h3>🚑 Immediate First Aid Steps</h3>
                <div className="actions-grid">
                  <div className="immediate-actions">
                    <h4>Immediate Actions</h4>
                    <ul>
                      {analysis.immediateActions?.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="first-aid-steps">
                    <h4>First Aid Procedure</h4>
                    <ol>
                      {analysis.firstAidSteps?.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              <div className="recommendations">
                <h3>📋 Professional Recommendations</h3>
                <ul>
                  {analysis.recommendations?.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
                
                {analysis.professionalHelpNeeded && (
                  <div className="professional-help">
                    <strong>💡 Important:</strong> It is recommended to consult with a healthcare professional for proper treatment.
                  </div>
                )}
              </div>

              <div className="analysis-actions">
                <button className="btn btn-outline">
                  Save Analysis Report
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/doctors'}
                >
                  Find Nearby Doctors
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="first-aid-tips">
          <h3>📝 First Aid Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>For Minor Cuts</h4>
              <p>Clean with soap and water, apply antibiotic ointment, cover with bandage</p>
            </div>
            <div className="tip-card">
              <h4>For Burns</h4>
              <p>Cool with running water for 10-15 minutes, don't use ice</p>
            </div>
            <div className="tip-card">
              <h4>For Sprains</h4>
              <p>Rest, Ice, Compression, Elevation (RICE method)</p>
            </div>
            <div className="tip-card">
              <h4>Emergency Signs</h4>
              <p>Heavy bleeding, difficulty breathing, loss of consciousness - call emergency services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstAid;