import React from 'react'
import { Link } from 'react-router-dom'
import { getApiUrl } from '../../config'
import { ArrowRight, Sparkles } from 'lucide-react'

const resolveImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return getApiUrl(`/api/profile/picture/${url}`)
}

interface StartupCardProps {
  id: number
  title: string
  tagline: string
  logo: string
  category: string
  founder_name: string
  founder_avatar: string
  pitch_overview: string
  pitch_deck_images: string[]
}

export const StartupCard: React.FC<StartupCardProps> = ({
  id, title, tagline, logo, category, founder_name, founder_avatar, pitch_overview, pitch_deck_images
}) => {
  const coverImage = pitch_deck_images && pitch_deck_images.length > 0
    ? resolveImageUrl(pitch_deck_images[0])
    : null

  return (
    <Link to={`/launchdeck/pitch/${id}`} className="group block">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
        {/* Cover Image / Gradient */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white/30" />
            </div>
          )}
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
              {category || 'Startup'}
            </span>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Logo + Title */}
          <div className="flex items-start gap-3 mb-3">
            {logo ? (
              <img
              src={resolveImageUrl(logo) || ''}
                alt={title}
                className="w-12 h-12 rounded-xl object-cover border-2 border-gray-100 shadow-sm flex-shrink-0 -mt-8 bg-white"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg -mt-8 border-2 border-white shadow-sm flex-shrink-0">
                {title?.charAt(0) || 'S'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors duration-300 truncate">
                {title}
              </h3>
              {tagline && (
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{tagline}</p>
              )}
            </div>
          </div>

          {/* Overview excerpt */}
          {pitch_overview && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
              {pitch_overview}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-2">
              {founder_avatar ? (
                <img
                  src={resolveImageUrl(founder_avatar) || ''}
                  alt={founder_name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold">
                  {founder_name?.charAt(0) || 'F'}
                </div>
              )}
              <span className="text-xs text-gray-500 font-medium">{founder_name}</span>
            </div>
            <div className="flex items-center gap-1 text-indigo-500 text-xs font-semibold group-hover:gap-2 transition-all duration-300">
              View Pitch
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
