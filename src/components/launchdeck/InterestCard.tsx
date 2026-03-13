import React, { useState } from 'react'
import { Heart, Send, CheckCircle, Loader2 } from 'lucide-react'

interface InterestCardProps {
  pitchId: number
  hasInterest: boolean
  interestCount: number
  isLoggedIn: boolean
  onSubmitInterest: (message: string) => Promise<void>
}

export const InterestCard: React.FC<InterestCardProps> = ({
  pitchId, hasInterest, interestCount, isLoggedIn, onSubmitInterest
}) => {
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(hasInterest)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmitInterest(message)
      setSubmitted(true)
      setShowForm(false)
    } catch (error) {
      console.error('Error submitting interest:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-gray-300 font-medium uppercase tracking-wider">Investor Interest</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{interestCount}</span>
          <span className="text-gray-400 text-sm">interested investors</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {submitted || hasInterest ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-500" />
            </div>
            <p className="text-green-700 font-semibold text-center">Interest Submitted!</p>
            <p className="text-sm text-gray-500 text-center">Our admin team will reach out to set up a meeting.</p>
          </div>
        ) : showForm ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the founder why you're interested..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                rows={4}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Interest
                </>
              )}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => isLoggedIn ? setShowForm(true) : window.location.href = '/login'}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
          >
            <Heart className="w-4 h-4" />
            I'M INTERESTED
          </button>
        )}
      </div>
    </div>
  )
}
