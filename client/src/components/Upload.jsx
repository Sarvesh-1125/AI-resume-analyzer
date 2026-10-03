import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

const loadingMessages = [
  'Reading your resume...',
  'Extracting your skills...',
  'Analyzing experience...',
  'Generating insights...',
  'Almost done...'
]

function Upload({ onResult }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingStep, setLoadingStep] = useState(0)

  const startLoadingAnimation = () => {
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < loadingMessages.length) {
        setLoadingStep(step)
      } else {
        clearInterval(interval)
      }
    }, 1500)
    return interval
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setLoading(true)
    setError('')
    setLoadingStep(0)

    const interval = startLoadingAnimation()
    const formData = new FormData()
    formData.append('resume', file)

    try {
      const res = await axios.post('https://resumeradar-backend-gvh7.onrender.com/api/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      clearInterval(interval)
      onResult(res.data.data, res.data.resumeText)
    } catch (err) {
      clearInterval(interval)
      setError('Failed to analyze resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [onResult])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  })

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6">

      {/* Hero Text */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Get Your Resume Analyzed</h2>
        <p className="text-gray-500 mt-2">Upload your resume and get instant AI-powered feedback in seconds</p>
      </div>

      {/* Feature Pills */}
      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {['📊 Resume Score', '🎯 Skill Analysis', '💡 AI Suggestions', '🔍 Job Matching'].map((f, i) => (
          <span key={i} className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-100">
            {f}
          </span>
        ))}
      </div>

      {/* Upload Box */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 bg-white'}`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <div>
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
            <p className="text-blue-600 font-semibold text-lg">{loadingMessages[loadingStep]}</p>
            <div className="flex justify-center gap-1 mt-4">
              {loadingMessages.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i <= loadingStep ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">📄</span>
            </div>
            <p className="text-xl font-bold text-gray-700">
              {isDragActive ? 'Drop it here!' : 'Drop your resume here'}
            </p>
            <p className="text-gray-400 mt-2">or click to browse files</p>
            <div className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium">
              Choose File
            </div>
            <p className="text-xs text-gray-400 mt-4">Supports PDF and DOCX — max 5MB</p>
          </div>
        )}
        {error && (
          <p className="text-red-500 mt-4 text-sm font-medium">{error}</p>
        )}
      </div>

      {/* Bottom Info */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {[
          { icon: '🔒', title: 'Private & Secure', desc: 'Your resume is never stored' },
          { icon: '⚡', title: 'Instant Results', desc: 'Analysis in under 10 seconds' },
          { icon: '🎯', title: 'AI Powered', desc: 'Using latest Groq LLaMA model' }
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="font-semibold text-gray-700 text-sm">{item.title}</p>
            <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Upload
