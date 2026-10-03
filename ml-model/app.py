from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load trained models
score_model = joblib.load('score_model.pkl')
interview_model = joblib.load('interview_model.pkl')

def extract_features(data):
    """Extract ML features from resume data"""
    skills = data.get('skills', [])
    experience = data.get('experience', '0')
    
    # Extract years from experience string
    years = 0
    if isinstance(experience, str):
        import re
        numbers = re.findall(r'\d+', experience)
        if numbers:
            years = int(numbers[0])
    
    # Count achievements from suggestions/strengths
    strengths = data.get('strengths', [])
    suggestions = data.get('suggestions', [])
    
    features = [
        min(years, 15),
        min(len(skills), 20),
        1 if any('project' in s.lower() for s in strengths + suggestions) else 0,
        1 if any('intern' in s.lower() for s in strengths + suggestions) else 0,
        1 if any('certif' in s.lower() for s in strengths + suggestions) else 0,
        2,
        len(strengths)
    ]
    
    return np.array(features).reshape(1, -1)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = extract_features(data)
        
        ml_score = float(score_model.predict(features)[0])
        ml_score = max(0, min(100, ml_score))
        
        interview_prob = float(interview_model.predict_proba(features)[0][1])
        interview_prob = round(interview_prob * 100, 1)
        
        ai_score = data.get('overallScore', 50)
        final_score = round((ml_score * 0.4) + (ai_score * 0.6))
        
        return jsonify({
            'success': True,
            'mlScore': round(ml_score),
            'finalScore': final_score,
            'interviewProbability': interview_prob,
            'selectionChance': 'High' if interview_prob >= 70 else 'Medium' if interview_prob >= 40 else 'Low'
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'ML Model API is running!'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
