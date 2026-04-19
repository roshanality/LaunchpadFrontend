import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getApiUrl } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { 
    Loader2, ArrowLeft, Rocket, Clock, ShieldCheck, 
    Video, FileText, MessageSquare, BarChart 
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export const CourseLearnPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { token } = useAuth()
    const navigate = useNavigate()
    const [courseTitle, setCourseTitle] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAccess = async () => {
            if (!token) {
                navigate('/login')
                return
            }

            try {
                // Fetch course details for the title
                const courseRes = await fetch(getApiUrl(`/api/courses/${id}`))
                if (courseRes.ok) {
                    const courseData = await courseRes.json()
                    setCourseTitle(courseData.title)
                }

                // Check enrollment status
                const statusRes = await fetch(getApiUrl(`/api/courses/${id}/enrollment-status`), {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                
                if (statusRes.ok) {
                    const statusData = await statusRes.json()
                    if (statusData.status !== 'approved') {
                        toast.error('You do not have access to this course material yet.')
                        navigate(`/courses/${id}`)
                    }
                } else {
                    navigate(`/courses/${id}`)
                }
            } catch (error) {
                console.error('Error checking access:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) checkAccess()
    }, [id, token, navigate])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate(`/courses/${id}`)}
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Course Details
                    </Button>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden border border-slate-200"
                >
                    <div className="relative h-64 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 flex items-center justify-center overflow-hidden">
                        {/* Abstract Background Design */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2)_0%,transparent_50%)]" />
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full blur-3xl animate-pulse" />
                        </div>
                        
                        <div className="relative z-10 text-center px-6">
                            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                                <Rocket className="h-10 w-10 text-blue-400" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Coming Soon</h2>
                            <p className="text-blue-200 text-lg">{courseTitle}</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">We're building something amazing!</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Our instructors are currently finalizing the course materials, editing videos, and preparing assignments to give you the best learning experience.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { 
                                    icon: Video, 
                                    title: "HD Video Lessons", 
                                    desc: "Comprehensive modules covering every aspect of the curriculum." 
                                },
                                { 
                                    icon: FileText, 
                                    title: "Resources & Assets", 
                                    desc: "Download files, templates, and guides to support your learning journey." 
                                },
                                { 
                                    icon: MessageSquare, 
                                    title: "Interactive Q&A", 
                                    desc: "Ask questions and get answers directly from mentors and peers." 
                                },
                                { 
                                    icon: BarChart, 
                                    title: "Progress Tracking", 
                                    desc: "Keep track of your completed modules and visualize your growth." 
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group">
                                    <div className="p-3 h-fit rounded-xl bg-white shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-indigo-600 text-white">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-indigo-900">Release Date</p>
                                    <p className="text-indigo-700 text-sm">Scheduled for release within 2 weeks</p>
                                </div>
                            </div>
                            <Button 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                                onClick={() => toast.success("We'll notify you when it's live!")}
                            >
                                <ShieldCheck className="h-5 w-5" />
                                Notify Me
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <div className="text-center mt-12 mb-20">
                    <p className="text-slate-400 text-sm">
                        KGP Forge Educational Platform &bull; IIT Kharagpur
                    </p>
                </div>
            </div>
        </div>
    )
}
