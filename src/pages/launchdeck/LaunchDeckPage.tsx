import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Rocket, TrendingUp, Users, Sparkles } from 'lucide-react'
import { StartupCard } from '../../components/launchdeck/StartupCard'
import { getApiUrl } from '../../config'

const CATEGORIES = [
  'All',
  'SaaS',
  'FinTech',
  'EdTech',
  'HealthTech',
  'AI/ML',
  'E-Commerce',
  'Social Impact',
  'Consumer',
  'DeepTech',
  'Other'
]

interface Pitch {
  id: number
  title: string
  tagline: string
  logo: string
  category: string
  status: string
  created_at: string
  founder_name: string
  founder_avatar: string
  pitch_overview: string
  pitch_deck_images: string[]
}

export const LaunchDeckPage: React.FC = () => {
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    fetchPitches()
  }, [selectedCategory, searchQuery])

  const fetchPitches = async () => {
    setLoading(true)
    try {
      let url = getApiUrl('/api/launchdeck/pitches?status=published')
      if (selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`
      }
      const res = await fetch(url)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B0E14] via-[#131832] to-[#1a1040]">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-indigo-300 text-sm font-medium mb-6 border border-white/10">
              <Rocket className="w-4 h-4" />
              Discover & Invest in IIT KGP Startups
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Launch<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Deck</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Browse startup pitches from IIT Kharagpur founders. Connect with innovative ventures and become part of the next big thing.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search startups by name, industry, or keyword..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md text-white placeholder:text-gray-400 rounded-2xl border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center gap-8 md:gap-16 mt-12"
          >
            {[
              { icon: Rocket, label: 'Active Pitches', value: pitches.length },
              { icon: Users, label: 'Founders', value: new Set(pitches.map(p => p.founder_name)).size },
              { icon: TrendingUp, label: 'Categories', value: new Set(pitches.map(p => p.category).filter(Boolean)).size },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-[calc(100%+1.3px)] h-[56px]" viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 56h1440V28c-240 20-480 28-720 28S240 48 0 28v28z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pitches Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading startups...</p>
            </div>
          </div>
        ) : pitches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-indigo-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No startups found</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search or filters.'
                : 'Be the first to pitch your startup!'}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {pitches.map((pitch, idx) => (
              <motion.div
                key={pitch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <StartupCard {...pitch} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
