import { useState } from 'react'
import Header from './components/Header'
import Upload from './components/Upload'
import Results from './components/Results'
import JobMatcher from './components/JobMatcher'
import JobMatchResults from './components/JobMatchResults'
import Chatbot from './components/Chatbot'

function App() {
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('analyze')
  const [jobMatchResult, setJobMatchResult] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')

  const handleResult = (data, text) => {
    setResult(data)
    setResumeText(text || '')
    console.log('Resume text length:', text ? text.length : 0)
  }

  const handleReset = () => {
    setResult(null)
  }

  const handleJobMatchResult = (data, jd) => {
    setJobMatchResult(data)
    setJobDescription(jd)
  }

  const handleJobMatchReset = () => {
    setJobMatchResult(null)
    setJobDescription('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Tabs */}
      <div className="max-w-4xl mx-auto mt-6 px-6">
        <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'analyze' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            📄 Analyze Resume
          </button>
          <button
            onClick={() => setActiveTab('match')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'match' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🎯 Job Matcher
          </button>
        </div>

        {resumeText ? (
          <p className="text-green-600 text-sm mt-2 font-medium">✅ Resume loaded and ready for matching</p>
        ) : (
          <p className="text-gray-400 text-sm mt-2">Upload your resume in Analyze tab first</p>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'analyze' ? (
        result ? (
          <Results data={result} onReset={handleReset} />
        ) : (
          <Upload onResult={handleResult} />
        )
      ) : (
        jobMatchResult ? (
          <JobMatchResults
            data={jobMatchResult}
            onReset={handleJobMatchReset}
            resumeText={resumeText}
            jobDescription={jobDescription}
          />
        ) : (
          <JobMatcher resumeText={resumeText} onResult={handleJobMatchResult} />
        )
      )}

      <Chatbot resumeData={result} />
    </div>
  )
}

export default App
