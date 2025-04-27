"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReviewItem } from "./ReviewItem"
import { ListFilter } from "lucide-react"
import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type ReviewsListProps = {
  reviews: Array<{
    reviewId: string
    reviewText: string
    rating: number
    term: string
    userId: string
    timestamp: string
  }>
  filterRating: number
  sortOption: "newest" | "highest" | "lowest" | "oldest"
  setSortOption: (option: "newest" | "highest" | "lowest" | "oldest") => void
  formatDate: (dateString: string) => string
  getTimeAgo: (dateString: string) => string
}

export function ReviewsList({
  reviews,
  filterRating,
  sortOption,
  setSortOption,
  formatDate,
  getTimeAgo,
}: ReviewsListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 10

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

  const totalReviews = processedReviews.length
  const totalPages = Math.ceil(totalReviews / reviewsPerPage)
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages))
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage)
  }

  const indexOfLastReview = validCurrentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = processedReviews.slice(indexOfFirstReview, indexOfLastReview)

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)

      let startPage = Math.max(2, validCurrentPage - 1)
      let endPage = Math.min(totalPages - 1, validCurrentPage + 1)

      if (validCurrentPage <= 3) {
        endPage = Math.min(4, totalPages - 1)
      }

      if (validCurrentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3)
      }

      if (startPage > 2) {
        pageNumbers.push("ellipsis-start")
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end")
      }

      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

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
                onChange={(e) => setSortOption(e.target.value as "newest" | "highest" | "lowest" | "oldest")}
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
            <>
              <div className="space-y-4">
                {currentReviews.map((review) => (
                  <div
                    key={review.reviewId}
                    className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <ReviewItem review={review} formatDate={formatDate} getTimeAgo={getTimeAgo} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (validCurrentPage > 1) setCurrentPage(validCurrentPage - 1)
                          }}
                          className={validCurrentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {getPageNumbers().map((page, index) => {
                        if (page === "ellipsis-start" || page === "ellipsis-end") {
                          return (
                            <PaginationItem key={`ellipsis-${index}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }

                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={page === validCurrentPage}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(page as number)
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (validCurrentPage < totalPages) setCurrentPage(validCurrentPage + 1)
                          }}
                          className={validCurrentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>

                  <div className="text-center mt-2 text-sm text-muted-foreground">
                    Showing {indexOfFirstReview + 1}-{Math.min(indexOfLastReview, totalReviews)} of {totalReviews}{" "}
                    reviews
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
