import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Globe, Linkedin, Twitter, Instagram, ArrowLeft, Share2,
  Users, Sparkles, ExternalLink, HandHeart, TrendingUp, Pencil
} from 'lucide-react'
import { PitchDeckCarousel } from '../../components/launchdeck/PitchDeckCarousel'
import { InterestCard } from '../../components/launchdeck/InterestCard'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const resolveImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return getApiUrl(`/api/profile/picture/${url}`)
}

interface PitchDetail {
  id: number
  founder_id: number
  title: string
  tagline: string
  logo: string
  pitch_overview: string
  highlights: Array<{ text: string }>
  team_members: Array<{ name: string; role: string; photo: string; bio: string; linkedin?: string }>
  pitch_deck_images: string[]
  category: string
  website: string
  social_links: { twitter?: string; instagram?: string; linkedin?: string }
  status: string
  created_at: string
  updated_at: string
  founder_name: string
  founder_avatar: string
  founder_email: string
  interest_count: number
}

export const PitchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user, token } = useAuth()
  const [pitch, setPitch] = useState<PitchDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasInterest, setHasInterest] = useState(false)
  const [mentorshipRequested, setMentorshipRequested] = useState(false)

  useEffect(() => {
    fetchPitch()
    if (user && token) {
      checkInterest()
    }
  }, [id, user])

  const fetchPitch = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/launchdeck/pitches/${id}`))
      if (res.ok) {
        const data = await res.json()
        setPitch(data)
      }
    } catch (error) {
      console.error('Error fetching pitch:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkInterest = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/launchdeck/pitches/${id}/interest/check`), {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setHasInterest(data.has_interest)
      }
    } catch (error) {
      console.error('Error checking interest:', error)
    }
  }

  const handleSubmitInterest = async (message: string) => {
    const res = await fetch(getApiUrl(`/api/launchdeck/pitches/${id}/interest`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    })

    if (res.ok) {
      toast.success('Interest submitted successfully!')
      setHasInterest(true)
      if (pitch) {
        setPitch({ ...pitch, interest_count: pitch.interest_count + 1 })
      }
    } else {
      const data = await res.json()
      toast.error(data.error || 'Failed to submit interest')
      throw new Error(data.error)
    }
  }

  const handleRequestMentorship = async () => {
    try {
      const res = await fetch(getApiUrl('/api/launchdeck/mentorship/request'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ pitch_id: parseInt(id!), message: 'Requesting mentorship guidance' })
      })

      if (res.ok) {
        toast.success('Mentorship request submitted!')
        setMentorshipRequested(true)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to request mentorship')
      }
    } catch (error) {
      toast.error('Failed to request mentorship')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!pitch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pitch not found</h2>
          <Link to="/launchdeck" className="text-indigo-600 hover:underline">Back to LaunchDeck</Link>
        </div>
      </div>
    )
  }

  const isOwner = user && user.id === pitch.founder_id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0B0E14] via-[#131832] to-[#1a1040]">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          {/* Back button */}
          <Link
            to="/launchdeck"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to LaunchDeck
          </Link>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Pitch Deck Carousel */}
            <div className="lg:col-span-2">
              <PitchDeckCarousel images={pitch.pitch_deck_images} title={pitch.title} />
            </div>

            {/* Right: Interest Card */}
            <div className="hidden lg:block">
              <InterestCard
                pitchId={pitch.id}
                hasInterest={hasInterest}
                interestCount={pitch.interest_count}
                isLoggedIn={!!user}
                onSubmitInterest={handleSubmitInterest}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company Profile Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {pitch.logo ? (
                <img
                  src={resolveImageUrl(pitch.logo) || ''}
                  alt={pitch.title}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {pitch.title?.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{pitch.title}</h1>
                {pitch.tagline && <p className="text-sm text-gray-500">{pitch.tagline}</p>}
              </div>
              {pitch.category && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                  {pitch.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {pitch.website && (
                <a href={pitch.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {pitch.social_links?.twitter && (
                <a href={pitch.social_links.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {pitch.social_links?.linkedin && (
                <a href={pitch.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {pitch.social_links?.instagram && (
                <a href={pitch.social_links.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              <button onClick={handleShare} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              {isOwner && (
                <Link
                  to={`/launchdeck/edit-pitch/${pitch.id}`}
                  className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 transition-colors"
                  title="Edit Pitch"
                >
                  <Pencil className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Pitch Overview */}
            {pitch.pitch_overview && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-500" />
                  Pitch Overview
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{pitch.pitch_overview}</p>
                </div>
              </motion.section>
            )}

            {/* Highlights */}
            {pitch.highlights && pitch.highlights.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-indigo-500" />
                  Highlights
                </h2>
                <div className="space-y-4">
                  {pitch.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 text-indigo-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{typeof highlight === 'string' ? highlight : highlight.text}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Our Team */}
            {pitch.team_members && pitch.team_members.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-500" />
                  Our Team
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pitch.team_members.map((member, idx) => (
                    <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          {member.photo ? (
                            <img
                              src={resolveImageUrl(member.photo) || ''}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                              {member.name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                              {member.role}
                            </span>
                          </div>
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="ml-auto text-gray-400 hover:text-indigo-600 transition-colors">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        {member.bio && (
                          <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Mentorship Request (for founder) */}
            {isOwner && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <HandHeart className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-bold text-gray-900">Need Mentorship?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Request a mentor to guide your startup journey. Our admin team will connect you with the right mentor.
                </p>
                <button
                  onClick={handleRequestMentorship}
                  disabled={mentorshipRequested}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    mentorshipRequested
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                  }`}
                >
                  {mentorshipRequested ? '✓ Mentorship Requested' : 'Request Mentorship'}
                </button>
              </motion.section>
            )}

            {/* Founder Info */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">About the Founder</h3>
              <div className="flex items-center gap-4">
                {pitch.founder_avatar ? (
                  <img
                    src={resolveImageUrl(pitch.founder_avatar) || ''}
                    alt={pitch.founder_name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                    {pitch.founder_name?.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">{pitch.founder_name}</h4>
                  <p className="text-sm text-gray-500">{pitch.founder_email}</p>
                </div>
                <Link
                  to={`/profile/${pitch.founder_id}`}
                  className="ml-auto px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-1 transition-colors"
                >
                  View Profile
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.section>
          </div>

          {/* Right Column: Sticky Interest Card (mobile) + Sidebar */}
          <div className="lg:hidden">
            <InterestCard
              pitchId={pitch.id}
              hasInterest={hasInterest}
              interestCount={pitch.interest_count}
              isLoggedIn={!!user}
              onSubmitInterest={handleSubmitInterest}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
