"use client"

import React, { useState } from 'react'
import CompanyProfile from '@/components/company/CompanyProfile'
import CompanyRatingDistribution from '@/components/company/CompanyRatingDistribution'
import CompanyReviewsList from '@/components/company/CompanyReviewsList'
import { NewReview } from '@/components/boss/NewReview'
import { formatDate, getTimeAgo } from '@/utils/date-utils'
import { 
  calculateAverageRating, 
  calculateRatingDistribution, 
  calculateRatingPercentages 
} from '@/utils/rating-utils'

export default function CompanyReviewPage() {
  const company = {
    "companyId": "1",
    "companyName": "Tech Corp",
    "streetAddress": "123 Tech Street",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94101",
    "timestamp": "2025-03-09T12:00:00.000Z"
  };

  const reviews = [
   {
      "reviewId": "1",
      "reviewText": "Great place to work!",
      "rating": 5,
      "term": "3",
      "userId": "1",
      "companyId": "1",
      "timestamp": "2025-03-09T12:00:00.000Z"
   },
   {
      "reviewId": "3",
      "reviewText": "Tech Corp has a lot of opportunities for growth, but the work-life balance could be better.",
      "rating": 3,
      "term": "5+",
      "companyId": "1",
      "timestamp": "2025-03-09T12:00:00.000Z"
   },
  ];

  // Calculate ratings data
  const averageRating = calculateAverageRating(reviews);
  const ratingDistribution = calculateRatingDistribution(reviews);
  const ratingPercentages = calculateRatingPercentages(ratingDistribution, reviews.length);

  // State for sorting and filtering
  const [sortOption, setSortOption] = useState("newest")
  const [filterRating, setFilterRating] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Boss Profile */}
        <CompanyProfile 
          company={company} 
          averageRating={averageRating} 
          reviewCount={reviews.length} 
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            Rating Distribution
            <CompanyRatingDistribution 
              ratingDistribution={ratingDistribution}
              ratingPercentages={ratingPercentages}
              filterRating={filterRating}
              setFilterRating={setFilterRating}
            />

            <NewReview />
          </div>

          {/* Reviews */}
          <div className="lg:col-span-2">
            <CompanyReviewsList 
              reviews={reviews}
              filterRating={filterRating}
              sortOption={sortOption}
              setSortOption={setSortOption}
              formatDate={formatDate}
              getTimeAgo={getTimeAgo}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
