"use client"

import { useState } from "react"
import { useParams } from "next/navigation"

import { BossProfile } from "@/components/boss/BossProfile"
import { RatingDistribution } from "@/components/boss/RatingDistribution"
import { ReviewsList } from "@/components/boss/ReviewsList"

import { formatDate, getTimeAgo } from "@/utils/date-utils"
import { calculateAverageRating, calculateRatingDistribution, calculateRatingPercentages } from "@/utils/rating-utils"
import { useGetBossInfoQuery, useGetBossReviewsQuery } from "@/app/state/api"

type Review = {
  reviewId: string
  reviewText: string
  rating: number
  term: string
  userId: string
  bossId: string
  timestamp: string
}

export default function BossReviewPage() {
  const { bossId } = useParams<{ bossId: string }>()
  const { data: boss } = useGetBossInfoQuery(bossId as string)
  const [sortOption, setSortOption] = useState<"newest" | "highest" | "lowest" | "oldest">("newest")
  const [filterRating, setFilterRating] = useState<number>(0)
  const { data: reviews = [] } = useGetBossReviewsQuery(bossId as string, {
    refetchOnMountOrArgChange: true,
  })

  const averageRating = calculateAverageRating(reviews)
  const ratingDistribution = calculateRatingDistribution(reviews)
  const ratingPercentages = calculateRatingPercentages(ratingDistribution, reviews.length)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {boss && 
          <BossProfile 
            boss={boss}
            averageRating={averageRating} 
            reviewCount={reviews.length} 
          />
        }

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1 space-y-6">
            <RatingDistribution
              ratingDistribution={ratingDistribution}
              ratingPercentages={ratingPercentages}
              filterRating={filterRating}
              setFilterRating={setFilterRating}
            />
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
        </div>
      </div>
    </div>
  )
}

