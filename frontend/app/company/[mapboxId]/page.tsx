"use client"

import React, { use, useState } from 'react'
import CompanyProfile from '@/components/company/CompanyProfile'
import CompanyRatingDistribution from '@/components/company/CompanyRatingDistribution'
import CompanyReviewsList from '@/components/company/CompanyReviewsList'
import { formatDate, getTimeAgo } from '@/utils/date-utils'
import { 
  calculateAverageRating, 
  calculateRatingDistribution, 
  calculateRatingPercentages 
} from '@/utils/rating-utils'
import { useParams } from 'next/navigation'
import { useGetCompanyByMapboxIdQuery, useGetCompanyReviewsQuery } from '@/app/state/api'

export default function CompanyReviewPage() {
  const { mapboxId } = useParams<{ mapboxId: string }>()
  const { data: company, isLoading, error } = useGetCompanyByMapboxIdQuery(mapboxId as string)
  const { data: reviews = [] } = useGetCompanyReviewsQuery(mapboxId as string, {
    refetchOnMountOrArgChange: true,
  })


  const averageRating = calculateAverageRating(reviews);
  const ratingDistribution = calculateRatingDistribution(reviews);
  const ratingPercentages = calculateRatingPercentages(ratingDistribution, reviews.length);

  const [sortOption, setSortOption] = useState("newest")
  const [filterRating, setFilterRating] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {company && (
          <CompanyProfile 
            company={company} 
            averageRating={averageRating} 
            reviewCount={reviews.length} 
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <CompanyRatingDistribution 
              ratingDistribution={ratingDistribution}
              ratingPercentages={ratingPercentages}
              filterRating={filterRating}
              setFilterRating={setFilterRating}
            />
          </div>

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
