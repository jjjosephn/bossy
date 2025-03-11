import { CheckCircle, ChevronRight, Search, Star, Users } from "lucide-react"
import type React from "react"
import { Button } from "@/components/ui/button"

type BenefitBadgeProps = {
  icon: React.ReactNode
  text: string
}

type ReviewCardProp = {
   rating: number
   date: Date
}

const BENEFITS = [
  { text: "100% Anonymous", icon: <CheckCircle className="h-4 w-4 text-primary" /> },
  { text: "Free Access", icon: <CheckCircle className="h-4 w-4 text-primary" /> },
]

const SAMPLE_REVIEWS = [
   { rating: 4, date: new Date('2024-03-15') }, 
   { rating: 5, date: new Date('2024-01-22') }, 
   { rating: 3, date: new Date('2023-12-10') }, 
   { rating: 1, date: new Date('2023-11-27') }  
 ];

const BenefitBadge = ({ icon, text }: BenefitBadgeProps) => (
  <div className="flex items-center gap-2 bg-primary/5 dark:bg-primary/10 rounded-full px-4 py-2">
    {icon}
    <span className="font-medium">{text}</span>
  </div>
)

const ReviewCard = ({ rating, date }: ReviewCardProp) => {
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="space-y-2 rounded-md bg-white dark:bg-gray-800 p-3 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center">
        <div className="flex">
          {[...Array(5)].map((_, j) => (
            <Star key={j} className={`h-4 w-4 ${j < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
          ))}
        </div>
        <span className="ml-auto text-xs text-gray-500">{formattedDate}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted-foreground/20" />
      <div className="h-2 w-4/5 rounded-full bg-muted-foreground/20" />
      {rating % 2 === 0 && <div className="h-2 w-3/5 rounded-full bg-muted-foreground/20" />}
    </div>
  )
}

const Hero = () => {
  return (
    <section className="w-full py-5 md:py-20 lg:py-24 overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        {/* Background decoration */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>

        <div className="grid gap-6 lg:grid-cols-[1fr_450px] lg:gap-12 xl:grid-cols-[1fr_600px] relative">
          {/* Hero Left - Now Centered */}
          <div className="flex flex-col justify-center items-center text-center space-y-6">
            <div className="inline-flex gap-2 items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium w-fit">
              <Star className="h-4 w-4 fill-primary" />
              <span>Empowering workplace transparency</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 text-transparent bg-clip-text">
              Rate Your Boss, Find Better Leadership
            </h1>

            <p className="max-w-[600px] text-gray-600 text-lg md:text-xl dark:text-gray-300">
              Discover what it's really like to work under different managers. Make informed career decisions with
              honest reviews from employees like you.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search for a company or manager..."
              />
              <Button className="absolute right-1.5 top-1.5 h-8 px-4 rounded-full" size="sm">
                Search
              </Button>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                className="rounded-full px-6 border-gray-300 hover:border-primary hover:bg-primary/5"
              >
                Learn how it works <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {BENEFITS.map((benefit, index) => (
                <BenefitBadge key={index} {...benefit} />
              ))}
            </div>
          </div>

          {/* Hero Right - Manager Profile Card */}
          <div className="flex items-center justify-center">
            <div className="relative h-[480px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-primary/5 to-primary/20 p-6 shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-md space-y-6 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  {/* Profile Header */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">John Doe</h3>
                        <p className="text-sm text-gray-500">Senior Manager at TechCorp</p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < 3 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">3.2</span>
                    </div>
                    <div className="text-sm text-gray-500">Based on 28 reviews</div>
                  </div>

                  {/* Reviews */}
                  <div className="space-y-3">
                     <div className="flex justify-between items-center">
                        <h4 className="font-medium">Recent Reviews</h4>
                     </div>
                     <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {SAMPLE_REVIEWS.map((review, index) => (
                           <ReviewCard key={index} {...review} />
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

