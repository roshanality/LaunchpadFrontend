import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, Eye, TrendingUp, Users, Rocket } from 'lucide-react'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface MyPitch {
  id: number
  title: string
  tagline: string
  logo: string
  category: string
  status: string
  created_at: string
  interest_count: number
  mentorship_count: number
}

export const MyPitchesPage: React.FC = () => {
  const { token } = useAuth()
  const [pitches, setPitches] = useState<MyPitch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyPitches()
  }, [])

  const fetchMyPitches = async () => {
    try {
      const res = await fetch(getApiUrl('/api/launchdeck/my-pitches'), {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPitches(data)
      }
    } catch (error) {
      console.error('Error fetching pitches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pitchId: number) => {
    if (!confirm('Are you sure you want to delete this pitch?')) return
    try {
      const res = await fetch(getApiUrl(`/api/launchdeck/pitches/${pitchId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success('Pitch deleted')
        setPitches(prev => prev.filter(p => p.id !== pitchId))
      }
    } catch (error) {
      toast.error('Failed to delete pitch')
    }
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Pitches</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your startup pitches</p>
          </div>
          <Link
            to="/launchdeck/create-pitch"
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Pitch
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : pitches.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Rocket className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No pitches yet</h3>
            <p className="text-gray-500 text-sm mb-6">Create your first pitch to get started!</p>
            <Link
              to="/launchdeck/create-pitch"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Your First Pitch
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pitches.map((pitch, idx) => (
              <motion.div
                key={pitch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  {pitch.logo ? (
                    <img src={getApiUrl(`/api/profile/picture/${pitch.logo}`)} alt={pitch.title} className="w-14 h-14 rounded-xl object-cover border border-gray-200" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {pitch.title?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg truncate">{pitch.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[pitch.status] || statusColors.draft}`}>
                        {pitch.status}
                      </span>
                    </div>
                    {pitch.tagline && <p className="text-sm text-gray-500 truncate">{pitch.tagline}</p>}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {pitch.interest_count} interests
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Users className="w-3.5 h-3.5" />
                        {pitch.mentorship_count} mentorship
                      </span>
                      {pitch.category && (
                        <span className="text-xs text-indigo-500 font-medium">{pitch.category}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/launchdeck/pitch/${pitch.id}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link to={`/launchdeck/edit-pitch/${pitch.id}`} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(pitch.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
