import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getApiUrl } from '../../config'

const resolveImageUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return getApiUrl(`/api/profile/picture/${url}`)
}

interface PitchDeckCarouselProps {
  images: string[]
  title?: string
}

export const PitchDeckCarousel: React.FC<PitchDeckCarouselProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
        <p className="text-gray-400 text-lg">No pitch deck uploaded yet</p>
      </div>
    )
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full">
      {/* Main Image */}
      <div className="relative aspect-[16/9] bg-gray-900 rounded-2xl overflow-hidden group">
        <img
          src={resolveImageUrl(images[currentIndex])}
          alt={`${title || 'Pitch'} - Slide ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Slide Counter */}
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                idx === currentIndex
                  ? 'border-indigo-500 opacity-100 ring-2 ring-indigo-500/30'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img
                src={resolveImageUrl(img)}
                alt={`Slide ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
