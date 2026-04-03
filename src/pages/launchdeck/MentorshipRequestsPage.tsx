import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Eye, HandHeart, User, Clock } from 'lucide-react'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface MentorshipRequest {
  id: number
  pitch_id: number
  founder_id: number
  mentor_id: number | null
  message: string
  status: string
  created_at: string
  pitch_title: string
  pitch_tagline: string
  pitch_logo: string
  pitch_category: string
  founder_name: string
  founder_avatar: string
  mentor_name: string | null
}

export const MentorshipRequestsPage: React.FC = () => {
  const { token } = useAuth()
  const [requests, setRequests] = useState<MentorshipRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await fetch(getApiUrl('/api/launchdeck/mentorship/requests'), {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Error fetching mentorship requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (requestId: number, status: 'accepted' | 'declined') => {
    try {
      const res = await fetch(getApiUrl(`/api/launchdeck/mentorship/requests/${requestId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success(`Request ${status}`)
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r))
      }
    } catch (error) {
      toast.error('Failed to update request')
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    assigned: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HandHeart className="w-8 h-8 text-indigo-500" />
            Mentorship Requests
          </h1>
          <p className="text-gray-500 text-sm mt-1">Startups looking for your mentorship guidance</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <HandHeart className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No mentorship requests yet</h3>
            <p className="text-gray-500 text-sm">Startups requesting mentorship will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req, idx) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  {req.pitch_logo ? (
                    <img src={getApiUrl(`/api/profile/picture/${req.pitch_logo}`)} alt={req.pitch_title} className="w-14 h-14 rounded-xl object-cover border border-gray-200" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {req.pitch_title?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-lg">{req.pitch_title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[req.status] || statusColors.pending}`}>
                        {req.status}
                      </span>
                    </div>
                    {req.pitch_tagline && <p className="text-sm text-gray-500">{req.pitch_tagline}</p>}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <User className="w-3.5 h-3.5" />
                        {req.founder_name}
                      </span>
                      {req.pitch_category && (
                        <span className="text-xs text-indigo-500 font-medium">{req.pitch_category}</span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {req.message && (
                      <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg italic">"{req.message}"</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/launchdeck/pitch/${req.pitch_id}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors" title="View Pitch">
                      <Eye className="w-4 h-4" />
                    </Link>
                    {(req.status === 'pending' || req.status === 'assigned') && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'accepted')}
                          className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                          title="Accept"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'declined')}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Decline"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
