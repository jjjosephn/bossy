"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetArchivedBossReviewsQuery } from "@/app/state/api"

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const ReviewHistoryTab = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: archivedReviews = [] } = useGetArchivedBossReviewsQuery()
  const sortedReviews = [...archivedReviews].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
  const reviewsPerPage = 10
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage)
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview)

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
                  <TableHead className="w-1/4">Review</TableHead>
                  <TableHead className="w-1/12">Status</TableHead>
                  <TableHead className="w-1/12">Requested Date</TableHead>
                  <TableHead className="w-1/12">Processed</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentReviews.map((review) => (
                  <TableRow key={review.archiveId}>
                    <TableCell className="align-top">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {review.User ? (
                            <>
                              {review.User.firstName} {review.User.lastName}
                            </>
                          ): (
                            "N/A"
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground break-words">{review.User?.email ?? ""}</span>
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
                      <div className="max-h-36 w-64 overflow-y-auto text-sm p-3 bg-muted/30 rounded-md border border-border whitespace-pre-wrap break-words">
                        {review.reviewText}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      {review.status === "accepted" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Accepted
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                          <XCircle className="h-3 w-3 mr-1" /> Declined
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground align-top whitespace-nowrap">
                      {formatDate(review.requestedDate)}
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
