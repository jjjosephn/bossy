"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanyReviewItem } from "./CompanyReviewItem"
import { ListFilter } from "lucide-react"

type ReviewsListProps = {
  reviews: Array<{
    reviewId: string
    reviewText: string
    rating: number
    term: string
    companyId: string
    timestamp: string
  }>
  filterRating: number
  sortOption: string
  setSortOption: (option: string) => void
  formatDate: (dateString: string) => string
  getTimeAgo: (dateString: string) => string
}

export default function CompanyReviewsList({
  reviews,
  filterRating,
  sortOption,
  setSortOption,
  formatDate,
  getTimeAgo,
}: ReviewsListProps) {
  const processedReviews = [...reviews]
    .filter((review) => filterRating === 0 || review.rating === filterRating)
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      } else if (sortOption === "oldest") {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      } else if (sortOption === "highest") {
        return b.rating - a.rating
      } else if (sortOption === "lowest") {
        return a.rating - b.rating
      }
      return 0
    })

  return (
    <div className="space-y-4">
      {/* Separated header card */}
      <Card className="bg-gradient-to-br from-primary/5 to-purple-600/5 dark:from-primary/5 dark:to-blue-400/5 border border-primary/10 shadow-md overflow-hidden">
        <CardHeader className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent flex items-center">
              Reviews
              {filterRating > 0 && (
                <span className="ml-3 text-sm font-medium text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">
                  {filterRating} ★ only
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 rounded-lg px-4 py-2.5 shadow-sm border border-primary/20 backdrop-blur-sm hover:border-primary/30 transition-colors">
              <ListFilter className="h-5 w-5 text-primary" />
              <select
                className="text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 appearance-none pr-8 py-0.5 text-gray-700 dark:text-gray-200"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ backgroundPosition: "right 0.25rem center" }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </CardHeader>
      
        <CardContent className="px-6 pb-6">
          {processedReviews.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground bg-white/40 dark:bg-gray-800/40 rounded-lg border border-primary/5">
              <p className="text-lg font-medium">No reviews match your filter criteria</p>
              <p className="text-sm mt-2">Try changing your filter or sorting options</p>
            </div>
          ) : (
            <div className="space-y-4">
              {processedReviews.map((review) => (
                <div key={review.reviewId} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <CompanyReviewItem 
                    review={review} 
                    formatDate={formatDate} 
                    getTimeAgo={getTimeAgo} 
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}