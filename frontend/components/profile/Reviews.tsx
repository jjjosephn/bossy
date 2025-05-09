"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Star, Building, Briefcase, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useGetReviewsByUserIdQuery } from "@/app/state/api"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

const Reviews = () => {
   const { user } = useUser()
   const { data: reviews = [] } = useGetReviewsByUserIdQuery(user?.id ?? "")
   const [page, setPage] = useState(0)

   const renderStars = (rating: number) => {
      const stars = []
      for (let i = 0; i < 5; i++) {
         stars.push(
            <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />,
         )
      }
      return stars
   }

   return (
      <Card className="shadow-md border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
         <CardHeader className="pb-2 pt-4">
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="text-lg">Your Reviews</CardTitle>
                  <CardDescription className="text-xs">View the reviews you've left</CardDescription>
               </div>
               <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 dark:from-primary/20 dark:to-blue-400/20 flex items-center justify-center">
                  <Star className="h-4 w-4 text-primary" />
               </div>
            </div>
         </CardHeader>

         {reviews?.length > 0 ? (
            <>
               <CardContent className="space-y-4 pt-0 px-3 ">
                  {reviews.slice(page * 10, page * 10 + 10).map((review) => (
                     <Link href={`/boss/${review.bossId}`} key={review.reviewId}>
                        <div
                           key={review.reviewId}
                           className="p-2 mb-4 rounded-md border transform transition duration-200 hover:scale-101 border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-5x`0 dark:from-gray-800 dark:to-gray-900 shadow-md"
                        >
                           <div className="flex items-start justify-between gap-1 mb-1.5">
                              <div>
                                 <h4 className="text-xs font-medium flex items-center gap-1">
                                    <Building className="h-3 w-3 text-primary" />
                                    {review.Boss.Company.companyName}
                                 </h4>
                                 <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <User className="h-2.5 w-2.5 text-primary" />
                                    {review.Boss.bossFirstName} {review.Boss.bossLastName}
                                    <span className="mx-0.5 text-gray-300 dark:text-gray-600">•</span>
                                    <Briefcase className="h-2.5 w-2.5" />
                                    <span className="truncate max-w-32">{review.Boss.position}</span>
                                 </p>
                              </div>
                              <div className="flex items-center">{renderStars(review.rating)}</div>
                           </div>
                           <div className="p-1.5 rounded bg-white/80 dark:bg-gray-800/80 text-xs">
                              <p className="line-clamp-3">{review.reviewText}</p>
                           </div>
                           <div className="flex justify-between items-center mt-1.5 text-xs text-muted-foreground">
                              <span className="text-2xs">
                                 Term: <span className="font-medium">{review.term} {review.term === "<1" ? 'year' : 'years'}</span>
                              </span>
                              <span className="text-2xs">
                                 {new Date(review.timestamp).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                 })}
                              </span>
                           </div>
                        </div>
                     </Link>
                  ))}
               </CardContent>

               {reviews.length > 10 && (
                  <CardFooter className="flex justify-center py-2">
                     <div className="flex items-center space-x-2">
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setPage((p) => Math.max(0, p - 1))}
                           disabled={page === 0}
                           className="h-7 w-7 p-0"
                        >
                           <ChevronLeft className="h-3 w-3" />
                           <span className="sr-only">Previous page</span>
                        </Button>
                        <div className="text-xs">
                           Page {page + 1} of {Math.ceil(reviews.length / 10)}
                        </div>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setPage((p) => Math.min(Math.ceil(reviews.length / 10) - 1, p + 1))}
                           disabled={page >= Math.ceil(reviews.length / 10) - 1}
                           className="h-7 w-7 p-0"
                        >
                           <ChevronRight className="h-3 w-3" />
                           <span className="sr-only">Next page</span>
                        </Button>
                     </div>
                  </CardFooter>
               )}
            </>
         ) : (
            <CardContent className="py-6">
               <div className="flex flex-col items-center justify-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-600/10 dark:from-primary/10 dark:to-blue-400/10 flex items-center justify-center">
                     <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium">No Reviews Yet</h3>
                  <p className="text-xs text-muted-foreground max-w-md">
                     You haven't written any reviews yet. Your reviews will appear here once you share your experiences.
                  </p>
                  <Link href="/">
                     <Button className="mt-1 text-xs py-1 h-8 bg-gradient-to-br from-primary/50 to-purple-400/50 dark:from-primary/50 dark:to-blue-300/50 hover:opacity-90">
                        Write Your First Review
                     </Button>
                  </Link>
               </div>
            </CardContent>
         )}
      </Card>
   )
}

export default Reviews