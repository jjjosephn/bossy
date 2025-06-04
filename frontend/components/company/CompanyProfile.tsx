import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin } from "lucide-react"

type CompanyProfileProps = {
  company: {
    companyId: string
    companyName: string
    fullAddress: string
    timestamp: string
  }
  averageRating?: number
  reviewCount?: number
}

const CompanyProfile = ({ 
  company, 
  averageRating = 0, 
  reviewCount = 0 
}: CompanyProfileProps) => {
  
  return (
    <div className="bg-gradient-to-br from-primary/5 to-purple-600/5 dark:from-primary/5 dark:to-blue-400/5 rounded-xl shadow-lg p-8 mb-8 border border-primary/10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-md">
            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-purple-600 dark:from-primary dark:to-blue-400 text-white">
              {company.companyName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-grow space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent">
            {company.companyName}
          </h1>

          <div className="flex flex-wrap gap-6 text-muted-foreground">
            <div className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">
               {company.fullAddress}
              </span>
            </div>
          </div>
        </div>

        <div className="md:border-l md:border-primary/10 md:pl-8 flex flex-col items-center justify-center py-4 md:py-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-xl font-medium text-muted-foreground">/5</div>
          </div>
          <div className="flex mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating) 
                    ? "fill-primary text-primary" 
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-2 font-medium">
            Based on {reviewCount} reviews
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyProfile