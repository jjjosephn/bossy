import { Star, Users } from 'lucide-react'
import React from 'react'

const ReviewCard = ({ rating, date, content }: { rating: number; date: Date; content: string }) => {
   const formattedDate = date.toLocaleDateString("en-US", {
   month: "short",
   day: "numeric",
   year: "numeric",
   })

   return (
   <div className="space-y-2 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center">
         <div className="flex">
         {[...Array(5)].map((_, j) => (
            <Star key={j} className={`h-4 w-4 ${j < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
         ))}
         </div>
         <span className="ml-auto text-xs text-gray-500">{formattedDate}</span>
      </div>
      {content ? (
         <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{content}</p>
      ) : (
         <>
         <div className="h-2 w-full rounded-full bg-muted-foreground/20" />
         <div className="h-2 w-4/5 rounded-full bg-muted-foreground/20" />
         {rating % 2 === 0 && <div className="h-2 w-3/5 rounded-full bg-muted-foreground/20" />}
         </>
      )}
   </div>
   )
}

const RightSection = () => {
   const SAMPLE_REVIEWS = [
      { rating: 4, date: new Date("2024-03-15"), content: "Great leadership style, always encouraging team growth." },
      { rating: 5, date: new Date("2024-01-22"), content: "Excellent mentor who provides clear guidance and feedback." },
      { rating: 3, date: new Date("2023-12-10"), content: "Decent manager but communication could be improved." },
      { rating: 1, date: new Date("2023-11-27"), content: "Poor work-life balance and unrealistic expectations." },
   ]

   return (
      <div className="flex items-center justify-center lg:justify-end">
         <div className="relative h-[460px] w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-primary/5 to-primary/20 p-6 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
            <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700">
               {/* Profile Header */}
               <div className="space-y-2">
                  <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/15 transition-all duration-300 hover:bg-primary/25">
                     <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold">John Doe</h3>
                     <p className="text-sm text-gray-500">Senior Manager at TechCorp</p>
                  </div>
                  </div>
               </div>

               {/* Rating with visual improvements */}
               <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                  <div className="flex">
                     {[...Array(5)].map((_, i) => (
                        <Star
                        key={i}
                        className={`h-6 w-6 ${i < 3 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} transition-all duration-300 hover:scale-110`}
                        />
                     ))}
                  </div>
                  <span className="ml-2 font-medium text-lg">3.2</span>
                  </div>
                  <div className="text-sm text-gray-500">Based on 28 reviews</div>
               </div>

               {/* Reviews with real content */}
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                  <h4 className="font-medium text-lg">Recent Reviews</h4>
                  </div>
                  <div className="space-y-4 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                  {SAMPLE_REVIEWS.map((review, index) => (
                     <ReviewCard key={index} {...review} />
                  ))}
                  </div>
               </div>
            </div>
            </div>
         </div>
      </div>
   )
}

export default RightSection