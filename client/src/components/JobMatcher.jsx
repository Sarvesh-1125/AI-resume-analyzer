import { useState } from 'react'
import axios from 'axios'

function JobMatcher({ resumeText, onResult }) {
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.')
      return
    }

    if (!resumeText) {
      setError('Please analyze your resume first in the Analyze Resume tab.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await axios.post('https://resumeradar-backend-gvh7.onrender.com/api/resume/match', {
        resumeText,
        jobDescription
      })
      onResult(res.data.data, jobDescription)
    } catch (err) {
      setError('Failed to match. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6">

      {!resumeText && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-700 text-sm font-medium">
            ⚠️ Please go to the <strong>Analyze Resume</strong> tab first and upload your resume. Then come back here to match with a job.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">🎯 Job Description Matcher</h2>
        <p className="text-gray-500 text-sm mb-6">Paste any job description below to see how well your resume matches</p>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full h-64 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 resize-none focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />

        {error && (
          <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
        )}

        <button
          onClick={handleMatch}
          disabled={loading}
          className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing Match...
            </span>
          ) : (
            'Match My Resume'
          )}
        </button>
      </div>
    </div>
  )
}

export default JobMatcher
