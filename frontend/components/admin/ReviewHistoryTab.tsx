"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// This would be replaced with your actual API hooks
const useMockArchivedReviews = () => {
  // Mock data - replace with your actual API call
  const archivedReviews = [
    {
      archiveId: "a1",
      bossId: "b1",
      userId: "u1",
      reviewText:
        "Great manager who really cares about the team. Always available for questions and provides clear direction.",
      status: "approved",
      requestedDate: "2023-04-15T10:30:00Z",
      timestamp: "2023-04-16T08:20:00Z",
      rating: 4,
      term: "Spring 2023",
      Boss: {
        bossFirstName: "John",
        bossLastName: "Smith",
        position: "Engineering Manager",
        Company: {
          companyName: "Tech Solutions Inc.",
        },
      },
      User: {
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex@example.com",
      },
    },
    {
      archiveId: "a2",
      bossId: "b2",
      userId: "u2",
      reviewText:
        "This review contains inappropriate language and personal attacks that violate our community guidelines.",
      status: "declined",
      requestedDate: "2023-10-20T14:45:00Z",
      timestamp: "2023-10-21T09:15:00Z",
      rating: 1,
      term: "Fall 2023",
      Boss: {
        bossFirstName: "Sarah",
        bossLastName: "Williams",
        position: "Product Manager",
        Company: {
          companyName: "Digital Innovations LLC",
        },
      },
      User: {
        firstName: "Taylor",
        lastName: "Smith",
        email: "taylor@example.com",
      },
    },
  ]

  const refetch = () => console.log("Refetching archived reviews")

  return { data: archivedReviews, refetch }
}

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

const ReviewHistoryTab = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: archivedReviews = [] } = useMockArchivedReviews()

  const reviewsPerPage = 10
  const totalPages = Math.ceil(archivedReviews.length / reviewsPerPage)
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = archivedReviews.slice(indexOfFirstReview, indexOfLastReview)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Review History</CardTitle>
            <CardDescription>View history of moderated boss reviews</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="whitespace-nowrap">
              {archivedReviews.length} processed
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {archivedReviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No review history to display</div>
        ) : (
          <div className="border rounded-md overflow-x-auto">
            <Table className="w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6">Reviewer</TableHead>
                  <TableHead className="w-1/6">Boss</TableHead>
                  <TableHead className="w-1/12">Term</TableHead>
                  <TableHead className="w-1/4">Review</TableHead>
                  <TableHead className="w-1/12">Submitted</TableHead>
                  <TableHead className="w-1/12">Status</TableHead>
                  <TableHead className="w-1/12">Processed</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentReviews.map((review) => (
                  <TableRow key={review.archiveId}>
                    <TableCell className="align-top">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {review.User.firstName} {review.User.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground break-words">{review.User.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {review.Boss.bossFirstName} {review.Boss.bossLastName}
                        </span>
                        <span className="text-xs text-muted-foreground">{review.Boss.position}</span>
                        <span className="text-xs text-muted-foreground">{review.Boss.Company.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{review.term}</span>
                        <StarRating rating={review.rating} />
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="max-h-36 w-64 overflow-y-auto text-sm p-3 bg-muted/30 rounded-md border border-border whitespace-normal">
                        {review.reviewText}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground align-top whitespace-nowrap">
                      {formatDate(review.requestedDate)}
                    </TableCell>
                    <TableCell className="align-top">
                      {review.status === "approved" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Approved
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                          <XCircle className="h-3 w-3 mr-1" /> Declined
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground align-top whitespace-nowrap">
                      {formatDate(review.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination controls */}
        {archivedReviews.length > reviewsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstReview + 1}-{Math.min(indexOfLastReview, archivedReviews.length)} of{" "}
              {archivedReviews.length}
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

export default ReviewHistoryTab
