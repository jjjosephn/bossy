"use client"

import React, { useState } from 'react'
import { BossProfile } from '@/components/boss/BossProfile'
import { RatingDistribution } from '@/components/boss/RatingDistribution'
import { ReviewsList } from '@/components/boss/ReviewsList'
import { NewReview } from '@/components/boss/NewReview'
import { formatDate, getTimeAgo } from '@/utils/date-utils'
import { 
  calculateAverageRating, 
  calculateRatingDistribution, 
  calculateRatingPercentages 
} from '@/utils/rating-utils'
import { useParams } from 'next/navigation'
import { useGetBossInfoQuery } from '@/app/state/api'

export default function BossReviewPage() {
  const params = useParams()
  const { bossId } = params
  const { data: boss } = useGetBossInfoQuery(bossId as string)
  console.log(boss)
  const reviews = [
    {
      "reviewId": "1",
      "reviewText": "Alice is an amazing boss who always supports her team!",
      "rating": 5,
      "term": "1-3",
      "userId": "1",
      "bossId": "1",
      "timestamp": "2025-03-15T10:30:00.000Z"
    },
    {
      "reviewId": "2",
      "reviewText": "The company environment is excellent!",
      "rating": 4,
      "term": "< 1",
      "userId": "2",
      "bossId": "1",
      "timestamp": "2025-03-09T12:00:00.000Z"
    },
    {
      "reviewId": "3",
      "reviewText": "Good leadership but could improve on providing clearer directions.",
      "rating": 3,
      "term": "3-5",
      "userId": "4",
      "bossId": "1",
      "timestamp": "2025-03-10T09:45:00.000Z"
    },
    {
      "reviewId": "4",
      "reviewText": "Very demanding and unrealistic expectations.",
      "rating": 2,
      "term": "1-3",
      "userId": "5",
      "bossId": "1",
      "timestamp": "2025-03-12T14:20:00.000Z"
    },
    {
      "reviewId": "5",
      "reviewText": "Alice Johnson is a supportive manager, but there's room for improvement in communication.",
      "rating": 3,
      "term": "5+",
      "userId": "3",
      "bossId": "1",
      "timestamp": "2025-03-09T12:00:00.000Z"
    }
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

        {boss && (
          <BossProfile 
            boss={boss} 
            averageRating={averageRating} 
            reviewCount={reviews.length} 
          />
        )}

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            
            <RatingDistribution 
              ratingDistribution={ratingDistribution}
              ratingPercentages={ratingPercentages}
              filterRating={filterRating}
              setFilterRating={setFilterRating}
            />

            <NewReview />
          </div>

          <div className="lg:col-span-2">
            <ReviewsList 
              reviews={reviews}
              filterRating={filterRating}
              sortOption={sortOption}
              setSortOption={setSortOption}
              formatDate={formatDate}
              getTimeAgo={getTimeAgo}
            />
          </div>
        </div> */}
      </div>
    </div>
  )
}
