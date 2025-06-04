"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-toastify"
import { useGetPendingBossReviewsQuery, useAcceptPendingBossReviewMutation, useDeclinePendingBossReviewMutation } from "@/app/state/api"

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

const ReviewPendingTab = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [processingIds] = useState<string[]>([])
  const { data: pendingReviews = [], refetch } = useGetPendingBossReviewsQuery()
  const [acceptReview, {isLoading: isApproving}] = useAcceptPendingBossReviewMutation()
  const [declineReview, {isLoading: isDeclining}] = useDeclinePendingBossReviewMutation()

  const reviewsPerPage = 10
  const totalPages = Math.ceil(pendingReviews.length / reviewsPerPage)
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = pendingReviews.slice(indexOfFirstReview, indexOfLastReview)

  const handleApproveReview = async (reviewId: string, pendingId: string) => {
    try {
      await acceptReview({ reviewId, pendingId }).unwrap()
      toast.success("Review approved successfully")
      refetch()
    } catch (error) {
      console.error("Error approving review:", error)
      toast.error("Failed to approve review")
    }
  }

  const handleDeclineReview = async (reviewId: string, pendingId: string) => {
    try {
      await declineReview({reviewId, pendingId}).unwrap()
      toast.success("Review declined successfully")
      refetch()
    } catch (error) {
      console.error("Error declining review:", error)
      toast.error("Failed to decline review")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Pending Reviews</CardTitle>
            <CardDescription>Review and moderate user-submitted boss reviews</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="whitespace-nowrap">
              {pendingReviews.length} pending
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {pendingReviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No pending reviews to display</div>
        ) : (
          <div className="border rounded-md overflow-x-auto">
            <Table className="w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6">Reviewer</TableHead>
                  <TableHead className="w-1/6">Boss</TableHead>
                  <TableHead className="w-1/12">Term</TableHead>
                  <TableHead className="w-1/4">Review</TableHead>
                  <TableHead className="w-1/12">Requested Date</TableHead>
                  <TableHead className="w-1/6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentReviews.map((review) => (
                  <TableRow key={review.reviewId}>
                    <TableCell className="align-top">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {review.Review.User ? (
                            <>
                              {review.Review.User.firstName} {review.Review.User.lastName}
                            </>
                          ): (
                            "N/A"
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground break-words">{review.Review.User?.email ?? ""}</span>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {review.Review.Boss.bossFirstName} {review.Review.Boss.bossLastName}
                        </span>
                        <span className="text-xs text-muted-foreground">{review.Review.Boss.position}</span>
                        <span className="text-xs text-muted-foreground">{review.Review.Boss.Company.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{review.Review.term} years</span>
                        <StarRating rating={review.Review.rating} />
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="max-h-36 w-64 overflow-y-auto text-sm p-3 bg-muted/30 rounded-md border border-border whitespace-normal">
                        {review.Review.reviewText}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground align-top whitespace-nowrap">
                      {formatDate(review.Review.timestamp)}
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveReview(review.reviewId, review.pendingId)}
                          disabled={processingIds.includes(review.reviewId)}
                          className="w-full"
                        >
                          {processingIds.includes(review.reviewId) && isApproving ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Check className="h-4 w-4 mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeclineReview(review.reviewId, review.pendingId)}
                          disabled={processingIds.includes(review.reviewId)}
                        >
                          {processingIds.includes(review.reviewId) && isDeclining ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <X className="h-4 w-4 mr-1" />
                          )}
                          Decline
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination controls */}
        {pendingReviews.length > reviewsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstReview + 1}-{Math.min(indexOfLastReview, pendingReviews.length)} of{" "}
              {pendingReviews.length}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm mx-2">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ReviewPendingTab
