from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor

app = Flask(__name__)
CORS(app)

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
SCORE_MODEL_PATH = os.path.join(MODEL_DIR, 'score_model.pkl')
INTERVIEW_MODEL_PATH = os.path.join(MODEL_DIR, 'interview_model.pkl')

def build_models():
    data = {
        'years_experience': [0,1,2,3,5,7,10,0,1,2,3,4,6,8,0,1,2,4,5,8],
        'num_skills': [3,5,7,8,10,12,15,2,4,6,9,11,13,14,1,3,5,8,10,12],
        'has_projects': [1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0,1,1,1,1],
        'has_internship': [0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1],
        'has_certifications': [0,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,1,1],
        'education_level': [1,1,2,2,2,3,3,1,1,1,2,2,2,3,1,1,2,2,2,3],
        'num_achievements': [0,1,2,3,4,5,6,0,0,1,2,3,4,5,0,0,1,2,3,4],
        'resume_score': [45,55,65,70,78,85,92,30,48,58,72,76,83,88,25,40,55,68,75,87],
        'got_interview': [0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1]
    }
    df = pd.DataFrame(data)
    features = ['years_experience','num_skills','has_projects','has_internship',
                'has_certifications','education_level','num_achievements']
    X = df[features]

    score_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    score_model.fit(X, df['resume_score'])

    interview_model = RandomForestClassifier(n_estimators=100, random_state=42)
    interview_model.fit(X, df['got_interview'])

    joblib.dump(score_model, SCORE_MODEL_PATH)
    joblib.dump(interview_model, INTERVIEW_MODEL_PATH)
    return score_model, interview_model

def load_models():
    if os.path.exists(SCORE_MODEL_PATH) and os.path.exists(INTERVIEW_MODEL_PATH):
        return joblib.load(SCORE_MODEL_PATH), joblib.load(INTERVIEW_MODEL_PATH)
    return build_models()

score_model, interview_model = load_models()

def extract_features(data):
    skills = data.get('skills', [])
    experience = data.get('experience', '0')
    years = 0
    if isinstance(experience, str):
        import re
        numbers = re.findall(r'\d+', experience)
        if numbers:
            years = int(numbers[0])

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
        data = request.json or {}
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
