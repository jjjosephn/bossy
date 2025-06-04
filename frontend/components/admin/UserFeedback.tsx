"use client"
import React from 'react'
import { useState } from 'react'
import { MessageSquare, Search, Mail, Calendar, ThumbsUp, ThumbsDown, Phone, Star, Eye, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAcknowledgeFeedbackMutation, useGetFeedbacksQuery } from '@/app/state/api'
import { formatDate } from '@/utils/date-utils'
import { Button } from '../ui/button'

type Feedback = {
   feedbackId: string
   description: string
   email: string
   feedbackType: string
   rating?: number
   contactBack?: boolean
   timestamp: string
}

export default function UserFeedback () {
  const [searchTerm, setSearchTerm] = useState("")
   const [filterType, setFilterType] = useState("all")
   const [filterRating, setFilterRating] = useState("all")
   const { data: feedbacks = [], refetch: refetchfeedbacks } = useGetFeedbacksQuery(undefined, {
      refetchOnMountOrArgChange: true,
   })
   const [acknowledgeFeedback] = useAcknowledgeFeedbackMutation()

   console.log("Feedbacks:", feedbacks)
   const filteredFeedbacks = feedbacks.filter((feedback: Feedback) => {
      const matchesSearch = feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feedback.feedbackType.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = filterType === "all" || feedback.feedbackType === filterType
      const matchesRating = filterRating === "all" || feedback.rating?.toString() === filterRating
      
      return matchesSearch && matchesType && matchesRating
   })

   const getRatingColor = (rating: number) => {
      if (rating >= 4) return "text-emerald-600"
      if (rating >= 3) return "text-amber-500"
      return "text-red-500"
   }

   const getRatingBg = (rating: number) => {
      if (rating >= 4) return "bg-emerald-50 border-emerald-200"
      if (rating >= 3) return "bg-amber-50 border-amber-200"
      return "bg-red-50 border-red-200"
   }

   const getRatingIcon = (rating: number) => {
      if (rating >= 4) return <ThumbsUp className="h-4 w-4" />
      if (rating >= 3) return <Star className="h-4 w-4" />
      return <ThumbsDown className="h-4 w-4" />
   }

   const getTypeColor = (type: string) => {
      switch (type) {
         case "bug": return "bg-red-100 text-red-800 border-red-200"
         case "suggestion": return "bg-blue-100 text-blue-800 border-blue-200"
         case "general": return "bg-green-100 text-green-800 border-green-200"
         case "ui": return "bg-purple-100 text-purple-800 border-purple-200"
         default: return "bg-gray-100 text-gray-800 border-gray-200"
      }
   }

   const getTypeIcon = (type: string) => {
      switch (type) {
         case "bug": return "🐛"
         case "suggestion": return "✨"
         case "general": return "💬"
         case "ui": return "🎨"
         default: return "📝"
      }
   }

   const reformatType = (type: string) => {
      switch (type) {
         case "bug": return "Bug Report"
         case "suggestion": return "Feature Request"
         case "general": return "General Feedback"
         case "ui": return "UI/UX Feedback"
         default: return type.charAt(0).toUpperCase() + type.slice(1)
      }
   }

   const handleAcknowledgedFeedback = async (feedbackId: string) => {
      try {
         await acknowledgeFeedback(feedbackId).unwrap()
         refetchfeedbacks()
      } catch (error) {
         console.error("Failed to acknowledge feedback:", error)
      }
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
         <div className="max-w-7xl mx-auto space-y-8">
            {/* Filters and Search */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
               <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                     <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1 max-w-sm">
                           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                           <Input
                              placeholder="Search feedbacks..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-12 h-12 border-0 bg-gray-50 focus:bg-white transition-colors rounded-xl"
                           />
                        </div>
                        
                        <div className="flex gap-3">
                           <Select value={filterType} onValueChange={setFilterType}>
                              <SelectTrigger className="w-full sm:w-[180px] h-12 border-0 bg-gray-50 rounded-xl">
                                 <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <SelectValue placeholder="Filter by type" />
                                 </div>
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="all">All Types</SelectItem>
                                 <SelectItem value="bug">🐛 Bug Report</SelectItem>
                                 <SelectItem value="suggestion">✨ Feature Request</SelectItem>
                                 <SelectItem value="general">💬 General</SelectItem>
                                 <SelectItem value="ui">🎨 UI/UX</SelectItem>
                              </SelectContent>
                           </Select>

                           <Select value={filterRating} onValueChange={setFilterRating}>
                              <SelectTrigger className="w-full sm:w-[180px] h-12 border-0 bg-gray-50 rounded-xl">
                                 <SelectValue placeholder="Filter by rating" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="all">All Ratings</SelectItem>
                                 <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                                 <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                                 <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                                 <SelectItem value="2">⭐⭐ (2)</SelectItem>
                                 <SelectItem value="1">⭐ (1)</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full">
                        <span className="text-sm font-medium text-blue-800">
                           {filteredFeedbacks.length} feedback{filteredFeedbacks.length !== 1 ? 's' : ''}
                        </span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Feedback Cards */}
            <div className="grid gap-6">
               {filteredFeedbacks.map((feedback: Feedback) => (
                  <Card key={feedback.feedbackId} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                     <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                           <div className="flex items-center gap-4 flex-wrap">
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getTypeColor(feedback.feedbackType)}`}>
                                 <span>{getTypeIcon(feedback.feedbackType)}</span>
                                 {reformatType(feedback.feedbackType)}
                              </div>
                              
                              {feedback.rating && (
                                 <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getRatingBg(feedback.rating)}`}>
                                    <div className={getRatingColor(feedback.rating)}>
                                       {getRatingIcon(feedback.rating)}
                                    </div>
                                    <span className={`font-semibold ${getRatingColor(feedback.rating)}`}>
                                       {feedback.rating}/5
                                    </span>
                                 </div>
                              )}
                              
                              {feedback.contactBack && (
                                 <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-sm font-medium">Contact Requested</span>
                                 </div>
                              )}
                           </div>
                           
                           <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                              <Calendar className="h-4 w-4" />
                              {formatDate(feedback.timestamp)}
                           </div>
                        </div>
                     </CardHeader>
                     
                     <CardContent className="space-y-4">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                           <p className="text-gray-700 leading-relaxed line-clamp-3">
                              {feedback.description}
                           </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                           <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                 <Mail className="h-4 w-4" />
                                 <span className="text-sm font-medium">{feedback.email}</span>
                              </div>
                           </div>

                           <Button 
                              variant="outline" 
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                              onClick={() => handleAcknowledgedFeedback(feedback.feedbackId)}
                           >
                              <Eye className="h-4 w-4 mr-2" />
                              Acknowledge
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>

            {filteredFeedbacks.length === 0 && (
               <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="text-center py-16">
                     <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-6">
                        <MessageSquare className="h-10 w-10 text-gray-400" />
                     </div>
                     <h3 className="text-xl font-semibold mb-3 text-gray-800">No feedback found</h3>
                     <p className="text-gray-600 max-w-md mx-auto">
                        {searchTerm || filterType !== "all" || filterRating !== "all" 
                           ? "Try adjusting your search terms or filters to find what you're looking for." 
                           : "No feedback submissions yet. Check back later for user insights."}
                     </p>
                  </CardContent>
               </Card>
            )}
         </div>
      </div>
   )
}