# 🤖 AI Resume Analyzer

ResumeRadar is an AI-powered resume analysis and job matching application. Upload a PDF or DOCX resume to receive a resume score, extracted skills, strengths, weaknesses, improvement suggestions, job matching, and an AI career assistant.

🔗 **Live Demo:** https://ai-resume-analyzer-phi-lilac.vercel.app/

## Features

- Resume analysis for PDF and DOCX files
- AI-generated resume score, skill extraction, strengths, weaknesses, and suggestions
- Job description matching with matched and missing skills
- AI-generated SOP / cover letter for a target role
- AI career assistant chatbot with resume context
- Optional ML model predictions for resume score and interview probability
- Client-side PDF report generation
- Resume upload files are removed after processing

## Tech Stack

**Frontend**
- React 19
- Vite
- Tailwind CSS
- Axios
- React Dropzone
- jsPDF

**Backend**
- Node.js
- Express
- Groq SDK (LLaMA 3.3 70B)
- Mammoth
- pdfjs-dist
- Multer
- Helmet
- CORS

**ML service**
- Python
- Flask
- scikit-learn
- joblib
- NumPy / pandas

## Project Structure

```
AI-resume-analyzer/
├── client/                 # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── App.jsx
│       └── main.jsx
├── server/                 # Express API
│   ├── controllers/
│   ├── routes/
│   └── index.js
├── ml-model/               # Optional Flask ML service
│   ├── app.py
│   └── train_model.py
└── start.bat.txt
```

## Run Locally

### 1. Clone

```bash
git clone https://github.com/Sarvesh-1125/AI-resume-analyzer.git
cd AI-resume-analyzer
```

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

Start it:

```bash
node index.js
```

### 3. Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

### 4. ML Service (optional)

```bash
cd ml-model
pip install -r requirements.txt
python app.py
```

The frontend currently calls the deployed ML endpoint configured in `client/src/components/Results.jsx`.

## API

Base path: `/api/resume`

- `POST /analyze` — analyze an uploaded resume
- `POST /match` — compare resume text against a job description
- `POST /chat` — chat with the career assistant
- `POST /generate-sop` — generate a tailored SOP / cover letter

## Environment & Security

Do not commit API keys, `.env` files, uploaded resumes, or `node_modules`. The repository's `.gitignore` excludes these local/runtime artifacts.

## Author

**Sarvesh Choudhary** — https://github.com/Sarvesh-1125
