"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { NewReview } from "@/components/boss/NewReview"


type RatingDistributionProps = {
  ratingDistribution: number[]
  ratingPercentages: number[]
  filterRating: number
  setFilterRating: (rating: number) => void
}

export function RatingDistribution({
  ratingDistribution,
  ratingPercentages,
  filterRating,
  setFilterRating,
}: RatingDistributionProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-purple-600/5 dark:from-primary/5 dark:to-blue-400/5 border border-primary/10 shadow-md overflow-hidden">
      <CardContent className="px-6">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent">Rating Distribution</h2>
        {[5, 4, 3, 2, 1].map((rating) => (
          <div
            key={rating}
            className="flex items-center mb-4 group cursor-pointer hover:bg-primary/5 rounded-md p-1 transition-colors"
            onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}
          >
            <div className="w-12 text-sm font-medium flex items-center gap-1">
              {rating}{" "}
              <Star
                className={`h-3 w-3 ${
                  filterRating === rating 
                    ? "fill-primary text-primary" 
                    : "text-muted-foreground group-hover:text-primary group-hover:fill-primary/30"
                }`}
              />
            </div>
            <div className="flex-1 mx-3">
              <Progress
                value={ratingPercentages[rating - 1]}
                className={`h-2.5 ${
                  filterRating === rating 
                    ? "bg-gradient-to-r from-primary/20 to-purple-600/20 dark:from-primary/20 dark:to-blue-400/20" 
                    : "bg-white"
                }`}
              />
            </div>
            <div className="w-16 text-sm font-medium text-right">
              {ratingDistribution[rating - 1]} ({isNaN(ratingPercentages[rating - 1]) ? 'N/A' : ratingPercentages[rating - 1].toFixed(0) + '%'})
            </div>
          </div>
        ))}
        {filterRating > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 w-full text-xs hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 dark:hover:from-primary/10 dark:hover:to-blue-400/10 text-primary/80"
            onClick={() => setFilterRating(0)}
          >
            Clear filter
          </Button>
        )}
      </CardContent>
      <NewReview />
    </Card>
    
  )
}