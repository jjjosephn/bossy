import { Star, Calendar, ThumbsUp, ThumbsDown, Share2, Flag, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ReviewItemProps = {
  review: {
    reviewId: string
    reviewText: string
    rating: number
    term: string
    userId: string
    timestamp: string
  }
  formatDate: (dateString: string) => string
  getTimeAgo: (dateString: string) => string
}

export function ReviewItem({ review, formatDate, getTimeAgo }: ReviewItemProps) {
  // Function to determine the rating color - using lighter colors
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-400/80" // Lighter green
    if (rating >= 3) return "bg-amber-400/80" // Lighter amber
    return "bg-red-400/80" // Lighter red
  }

  return (
    <div>
      <div className="flex gap-4">
        {/* Rating Badge - On the left */}
        <div className="flex-shrink-0">
          <div className={`flex flex-col items-center justify-center ${getRatingColor(review.rating)} text-white rounded-lg w-14 h-14`}>
            <div className="text-xl font-bold">{review.rating}</div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-2 w-2 ${i < review.rating ? "fill-white" : "fill-white/30"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            {/* Date moved to upper right as requested */}
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span title={formatDate(review.timestamp)}>{getTimeAgo(review.timestamp)}</span>
            </div>
          </div>

          <p className="my-3 text-base">{review.reviewText}</p>

          <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
            <TooltipProvider>
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="flex items-center gap-1 py-1 px-2 bg-primary/5">
                      <Briefcase className="h-3 w-3" />
                      <span>{review.term} {parseInt(review.term) === 1 || review.term === "< 1" ? "year" : "years"}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Employee tenure</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2 rounded-full hover:bg-primary/10">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="ml-1 text-xs">12</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as helpful</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2 rounded-full hover:bg-primary/10">
                      <ThumbsDown className="h-4 w-4" />
                      <span className="ml-1 text-xs">3</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as not helpful</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share this review</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Report this review</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
}