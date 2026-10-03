import { useState } from 'react'
import axios from 'axios'

function JobMatchResults({ data, onReset, resumeText, jobDescription }) {
  const [sop, setSop] = useState('')
  const [sopLoading, setSopLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [copied, setCopied] = useState(false)

  const generateSOP = async () => {
    setSopLoading(true)
    try {
      const res = await axios.post('https://resumeradar-backend-gvh7.onrender.com/api/resume/generate-sop', {
        resumeText,
        jobDescription,
        userName
      })
      setSop(res.data.sop)
    } catch (err) {
      setSop('Failed to generate SOP. Please try again.')
    } finally {
      setSopLoading(false)
    }
  }

  const copySOP = () => {
    navigator.clipboard.writeText(sop)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6 pb-16">

      {/* Match Score */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Job Match Score</h2>
            <p className="text-gray-500 mt-1">Based on your resume vs the job description</p>
          </div>
          <div className="text-center">
            <div className={`text-6xl font-bold ${
              data.matchScore >= 70 ? 'text-green-500' :
              data.matchScore >= 50 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {data.matchScore}%
            </div>
            <p className="text-gray-400 text-sm">match rate</p>
          </div>
        </div>
        <div className="mt-6 bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              data.matchScore >= 70 ? 'bg-green-500' :
              data.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${data.matchScore}%` }}
          ></div>
        </div>
      </div>

      {/* Matched and Missing Skills */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
          <h3 className="font-semibold text-green-700 mb-3">✅ Matched Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.matchedSkills.map((skill, i) => (
              <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
          <h3 className="font-semibold text-red-700 mb-3">❌ Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((skill, i) => (
              <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">💡 How to Improve Your Match</h3>
        <ol className="space-y-3">
          {data.suggestions.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="text-blue-500 font-bold min-w-fit">{i + 1}.</span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* SOP Generator */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
        <h3 className="font-bold text-lg mb-2">📝 Generate SOP / Cover Letter</h3>
        <p className="text-blue-200 text-sm mb-4">Get a personalized Statement of Purpose for this job instantly!</p>
        
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name (optional)"
          className="w-full bg-white/20 text-white placeholder-blue-200 border border-white/30 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:border-white text-sm"
        />

        <button
          onClick={generateSOP}
          disabled={sopLoading}
          className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all disabled:opacity-50"
        >
          {sopLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Generating SOP...
            </span>
          ) : (
            '✨ Generate My SOP'
          )}
        </button>
      </div>

      {/* Generated SOP */}
      {sop && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700">📄 Your Generated SOP</h3>
            <button
              onClick={copySOP}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
            >
              {copied ? '✅ Copied!' : '📋 Copy SOP'}
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {sop}
          </div>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all font-medium"
      >
        Try Another Job Description
      </button>

    </div>
  )
}

export default JobMatchResults
