"use client"

import React, { useEffect, useState } from 'react'
import { MessageSquare, Send, CheckCircle, Bug, Lightbulb, Settings, Star } from 'lucide-react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useNewFeedbackMutation } from '../state/api'


type StarRatingProps = {
   rating: number | null
   setRating: (rating: number) => void
   label: string
}

export default function WebsiteFeedbackPage() {
   const { isSignedIn, user } = useUser()
   const clerk = useClerk()
   const [formData, setFormData] = useState({
      feedbackType: 'suggestion',
      description: '',
      rating: null as number | null, // Explicitly type as nullable
      contactBack: false
   })
   const [submitted, setSubmitted] = useState(false)
   const [errors, setErrors] = useState<Record<string, string | null>>({})
   const userEmail = user?.primaryEmailAddress?.emailAddress || ''
   const [submitFeedback] = useNewFeedbackMutation()

   const feedbackTypes = [
      { id: 'suggestion', label: 'Feature Request', icon: Lightbulb, description: 'Suggest new features or improvements' },
      { id: 'bug', label: 'Bug Report', icon: Bug, description: 'Report issues or problems' },
      { id: 'general', label: 'General Feedback', icon: MessageSquare, description: 'Share your thoughts about the site' },
      { id: 'ui', label: 'Design/UI', icon: Settings, description: 'Feedback about design and usability' }
   ]

   const StarRating = ({ rating, setRating, label }: StarRatingProps) => (
      <div className="space-y-2">
         <label className="block text-sm font-medium text-gray-700">{label}</label>
         <div className="flex space-x-1">
         {[1, 2, 3, 4, 5].map((star) => (
            <button
               key={star}
               type="button"
               onClick={() => setRating(star)}
               className="focus:outline-none transition-colors duration-150"
            >
               <Star
               className={`w-6 h-6 ${
                  rating !== null && star <= rating
                     ? 'text-yellow-400 fill-current' 
                     : 'text-gray-300 hover:text-yellow-300'
               }`}
               />
            </button>
         ))}
         </div>
         <p className="text-xs text-gray-500">
            {rating === null && 'Click to rate'}
            {rating === 1 && 'Very Poor'}
            {rating === 2 && 'Poor'}
            {rating === 3 && 'Average'}
            {rating === 4 && 'Good'}
            {rating === 5 && 'Excellent'}
         </p>
      </div>
   )

   const handleInputChange = (field: string, value: any) => {
      setFormData(prev => ({
         ...prev,
         [field]: value
      }))
      
      if (errors[field]) {
         setErrors(prev => ({
         ...prev,
         [field]: null
         }))
      }
   }

   const validateForm = () => {
      const newErrors: Record<string, string | null> = {}
      
      if (!formData.description.trim()) newErrors.description = 'Description is required'
      if (formData.description.length < 20) newErrors.description = 'Please provide more detail (minimum 20 characters)'
      
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handleSubmit = async () => {
      if (!isSignedIn) {
         clerk.openSignIn({
            redirectUrl: '/feedback',
            afterSignInUrl: '/feedback'
         })
         return
      }
      if (validateForm()) {
         setSubmitted(true)
         const submissionData = {
            ...formData,
            email: userEmail,
            rating: formData.rating === null ? undefined : formData.rating
         }
         try {
            await submitFeedback(submissionData).unwrap()
         } catch (error) {
            console.error('Error submitting feedback:', error)
            setSubmitted(false)
            setErrors({ ...errors, submit: 'Failed to submit feedback. Please try again later.' })
         }
      }
   }

   if (submitted) {
      return (
         <div className="min-h-screen flex items-center justify-center p-6">
         <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center border border-gray-200">
            <div className="mb-6">
               <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
               <CheckCircle className="w-8 h-8 text-green-600" />
               </div>
               <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
               <p className="text-gray-600">
               Your feedback has been submitted successfully. We appreciate you taking the time to help us improve Bossy.
               </p>
               {formData.contactBack && userEmail && (
               <p className="text-sm text-gray-500 mt-3">
                  We'll get back to you at {userEmail} if we need more information.
               </p>
               )}
            </div>
            <button
               onClick={() => {
               setSubmitted(false)
               setFormData({
                  feedbackType: 'suggestion',
                  description: '',
                  rating: null,
                  contactBack: false
               })
               }}
               className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
               Submit More Feedback
            </button>
         </div>
         </div>
      )
   }

   return (
      <div className="min-h-screen py-12 px-6">
         <div className="max-w-3xl mx-auto">
         {/* Header */}
         <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 mb-4">
               <MessageSquare className="w-5 h-5 text-gray-700" />
               <span className="text-gray-700 font-medium">Website Feedback</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
               Help Us Improve Bossy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
               Your feedback helps us make Bossy better for everyone. Share your ideas, report issues, or let us know what you think.
            </p>
         </div>

         {/* Form */}
         <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Feedback Type Selection */}
            <div className="p-6 border-b border-gray-200">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">What type of feedback do you have?</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {feedbackTypes.map((type) => {
                  const Icon = type.icon
                  return (
                     <button
                     key={type.id}
                     onClick={() => handleInputChange('feedbackType', type.id)}
                     className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        formData.feedbackType === type.id
                           ? 'border-gray-800 bg-gray-50'
                           : 'border-gray-200 hover:border-gray-300'
                     }`}
                     >
                     <Icon className="w-6 h-6 text-gray-600 mt-0.5" />
                     <div>
                        <div className="font-medium text-gray-800">{type.label}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                     </div>
                     </button>
                  )
               })}
               </div>
            </div>

            {/* Description */}
            <div className="p-6 border-b border-gray-200">
               <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
               </label>
               <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                     errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Please provide as much detail as possible. For bug reports, include steps to reproduce the issue. For feature requests, explain how it would help you."
               />
               <div className="flex justify-between items-center mt-2">
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  <p className="text-sm text-gray-500 ml-auto">
                     {formData.description.length} characters (minimum 20)
                  </p>
               </div>
               </div>
            </div>

            {/* Rating */}
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-orange-50">
               <div className="flex flex-col items-center">
                  <StarRating
                     rating={formData.rating}
                     setRating={(rating) => handleInputChange('rating', rating)}
                     label="Overall Experience (Optional)"
                  />
               </div>
            </div>

            {/* Contact Information */}
            <div className="p-6 border-b border-gray-200">
               <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                     <input
                        type="checkbox"
                        id="contactBack"
                        checked={formData.contactBack}
                        onChange={(e) => handleInputChange('contactBack', e.target.checked)}
                        className="rounded border-gray-300 text-gray-800 focus:ring-gray-500"
                     />
                     <label htmlFor="contactBack" className="text-sm text-gray-700">
                        I'd like you to contact me about this feedback
                     </label>
                  </div>
               </div>
            </div>

            {/* Submit */}
            <div className="p-6 bg-gray-50">
               <button
               onClick={handleSubmit}
               className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
               >
               <Send className="w-5 h-5" />
               <span>Submit Feedback</span>
               </button>
            </div>
         </div>
         </div>
      </div>
   )
}