import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Upload, Plus, Trash2, Save, Loader2,
  Image as ImageIcon, Users, Sparkles, TrendingUp, Globe, Send
} from 'lucide-react'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const CATEGORIES = ['SaaS', 'FinTech', 'EdTech', 'HealthTech', 'AI/ML', 'E-Commerce', 'Social Impact', 'Consumer', 'DeepTech', 'Other']

interface TeamMember {
  name: string
  role: string
  photo: string
  bio: string
  linkedin: string
}

interface Highlight {
  text: string
}

export const EditPitchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    logo: '',
    pitch_overview: '',
    category: '',
    website: '',
    social_links: { twitter: '', linkedin: '', instagram: '' },
    status: 'draft'
  })

  const [highlights, setHighlights] = useState<Highlight[]>([{ text: '' }])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: '', role: '', photo: '', bio: '', linkedin: '' }])
  const [pitchDeckImages, setPitchDeckImages] = useState<string[]>([])
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingDeck, setUploadingDeck] = useState(false)

  useEffect(() => {
    fetchPitch()
  }, [id])

  const fetchPitch = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/launchdeck/pitches/${id}`))
      if (res.ok) {
        const data = await res.json()
        setFormData({
          title: data.title || '',
          tagline: data.tagline || '',
          logo: data.logo || '',
          pitch_overview: data.pitch_overview || '',
          category: data.category || '',
          website: data.website || '',
          social_links: data.social_links || { twitter: '', linkedin: '', instagram: '' },
          status: data.status || 'draft'
        })
        setHighlights(data.highlights?.length > 0 ? data.highlights.map((h: any) => typeof h === 'string' ? { text: h } : h) : [{ text: '' }])
        setTeamMembers(data.team_members?.length > 0 ? data.team_members : [{ name: '', role: '', photo: '', bio: '', linkedin: '' }])
        setPitchDeckImages(data.pitch_deck_images || [])
      }
    } catch (error) {
      console.error('Error fetching pitch:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch(getApiUrl('/api/launchdeck/upload/pitch-image'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      })
      if (res.ok) return (await res.json()).filename
    } catch (error) { console.error('Upload error:', error) }
    return null
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    const filename = await uploadImage(file)
    if (filename) setFormData(prev => ({ ...prev, logo: filename }))
    setUploadingLogo(false)
  }

  const handleDeckUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploadingDeck(true)
    for (let i = 0; i < files.length; i++) {
      const filename = await uploadImage(files[i])
      if (filename) setPitchDeckImages(prev => [...prev, filename])
    }
    setUploadingDeck(false)
  }

  const handleSubmit = async (status: string) => {
    if (!formData.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      const payload = {
        ...formData,
        highlights: highlights.filter(h => h.text.trim()),
        team_members: teamMembers.filter(m => m.name.trim()),
        pitch_deck_images: pitchDeckImages,
        status
      }

      const res = await fetch(getApiUrl(`/api/launchdeck/pitches/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success('Pitch updated!')
        navigate('/launchdeck/my-pitches')
      } else {
        const errData = await res.json()
        toast.error(errData.error || 'Failed to update pitch')
      }
    } catch (error) { toast.error('Failed to update pitch') }
    finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Pitch</h1>
            <p className="text-gray-500 text-sm mt-1">Update your startup pitch</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Startup Logo</label>
                <div className="flex items-center gap-4">
                  {formData.logo ? (
                    <img src={getApiUrl(`/api/profile/picture/${formData.logo}`)} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400"><ImageIcon className="w-6 h-6" /></div>
                  )}
                  <label className="cursor-pointer px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 flex items-center gap-2">
                    {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingLogo ? 'Uploading...' : 'Change Logo'}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Startup Name *</label>
                <input value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
                <input value={formData.tagline} onChange={(e) => setFormData(p => ({ ...p, tagline: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                  <input value={formData.website} onChange={(e) => setFormData(p => ({ ...p, website: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5"><Globe className="w-4 h-4 inline mr-1" /> Social Links</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['twitter', 'linkedin', 'instagram'] as const).map(p => (
                    <input key={p} value={formData.social_links[p]} onChange={(e) => setFormData(prev => ({ ...prev, social_links: { ...prev.social_links, [p]: e.target.value } }))} placeholder={p.charAt(0).toUpperCase() + p.slice(1) + ' URL'} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pitch Deck */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-500" /> Pitch Deck Slides
            </h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {pitchDeckImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={getApiUrl(`/api/profile/picture/${img}`)} alt={`Slide ${idx + 1}`} className="w-24 h-16 rounded-lg object-cover border" />
                  <button onClick={() => setPitchDeckImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <label className="w-24 h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 flex items-center justify-center cursor-pointer">
                {uploadingDeck ? <Loader2 className="w-5 h-5 text-gray-400 animate-spin" /> : <Plus className="w-5 h-5 text-gray-400" />}
                <input type="file" accept="image/*" multiple onChange={handleDeckUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-500" /> Pitch Overview</h2>
            <textarea value={formData.pitch_overview} onChange={(e) => setFormData(p => ({ ...p, pitch_overview: e.target.value }))} placeholder="Describe your startup..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" rows={6} />
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500" /> Highlights</h2>
            <div className="space-y-3">
              {highlights.map((h, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full border-2 border-indigo-500 text-indigo-600 font-bold text-xs flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                  <input value={h.text} onChange={(e) => { const u = [...highlights]; u[idx] = { text: e.target.value }; setHighlights(u) }} placeholder="Key highlight..." className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
                  {highlights.length > 1 && <button onClick={() => setHighlights(prev => prev.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
              <button onClick={() => setHighlights(prev => [...prev, { text: '' }])} className="flex items-center gap-2 text-sm text-indigo-600 font-medium"><Plus className="w-4 h-4" /> Add Highlight</button>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500" /> Team Members</h2>
            <div className="space-y-4">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Member {idx + 1}</span>
                    {teamMembers.length > 1 && <button onClick={() => setTeamMembers(prev => prev.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={member.name} onChange={(e) => { const u = [...teamMembers]; u[idx] = { ...u[idx], name: e.target.value }; setTeamMembers(u) }} placeholder="Name" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20" />
                    <input value={member.role} onChange={(e) => { const u = [...teamMembers]; u[idx] = { ...u[idx], role: e.target.value }; setTeamMembers(u) }} placeholder="Role" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20" />
                    <input value={member.linkedin} onChange={(e) => { const u = [...teamMembers]; u[idx] = { ...u[idx], linkedin: e.target.value }; setTeamMembers(u) }} placeholder="LinkedIn URL" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <textarea value={member.bio} onChange={(e) => { const u = [...teamMembers]; u[idx] = { ...u[idx], bio: e.target.value }; setTeamMembers(u) }} placeholder="Short bio..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none bg-white focus:ring-2 focus:ring-indigo-500/20" rows={2} />
                </div>
              ))}
              <button onClick={() => setTeamMembers(prev => [...prev, { name: '', role: '', photo: '', bio: '', linkedin: '' }])} className="flex items-center gap-2 text-sm text-indigo-600 font-medium"><Plus className="w-4 h-4" /> Add Team Member</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 justify-end pt-4">
            <button onClick={() => navigate('/launchdeck/my-pitches')} className="px-6 py-3 text-gray-600 font-medium text-sm">Cancel</button>
            <button onClick={() => handleSubmit('draft')} disabled={saving} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm flex items-center gap-2">
              <Save className="w-4 h-4" /> Save as Draft
            </button>
            <button onClick={() => handleSubmit('published')} disabled={saving} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Update & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
