import { CheckCircle, Search, Star, Users } from "lucide-react"
import type React from "react"
import { Button } from "@/components/ui/button"

type BenefitBadgeProps = {
  icon: React.ReactNode
  text: string
}

type ReviewCardProp = {
  rating: number
  date: Date
  content?: string
}

const BENEFITS = [
  { text: "100% Anonymous", icon: <CheckCircle className="h-4 w-4 text-primary" /> },
  { text: "Free Access", icon: <CheckCircle className="h-4 w-4 text-primary" /> }
]

const SAMPLE_REVIEWS = [
  { 
    rating: 4, 
    date: new Date("2024-03-15"),
    content: "Great leadership style, always encouraging team growth."
  },
  { 
    rating: 5, 
    date: new Date("2024-01-22"),
    content: "Excellent mentor who provides clear guidance and feedback."
  },
  { 
    rating: 3, 
    date: new Date("2023-12-10"),
    content: "Decent manager but communication could be improved."
  },
  { 
    rating: 1, 
    date: new Date("2023-11-27"),
    content: "Poor work-life balance and unrealistic expectations."
  },
]

const BenefitBadge = ({ icon, text }: BenefitBadgeProps) => (
  <div className="flex items-center gap-2 bg-primary/10 dark:bg-primary/15 rounded-full px-4 py-2 transition-all duration-300 hover:bg-primary/20 cursor-pointer">
    {icon}
    <span className="font-medium">{text}</span>
  </div>
)

const ReviewCard = ({ rating, date, content }: ReviewCardProp) => {
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

const Hero = () => {
  return (
    <section className="w-full pb-12 md:pb-24 lg:pb-32 pt-6 md:pt-20 lg:pt-24 overflow-hidden relative bg-gradient-to-b from-gray-300 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 md:px-6 relative z-10 ">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-16 xl:grid-cols-[1fr_600px] items-center">
            {/* Hero Left - Text Content */}
            <div className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left space-y-6">
              <div className="inline-flex gap-2 items-center bg-primary/15 text-primary rounded-full px-4 py-1.5 text-sm font-medium w-fit animate-fadeIn">
                <Star className="h-4 w-4 fill-primary" />
                <span>Empowering workplace transparency</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 text-transparent bg-clip-text animate-gradientShift">
                Rate Your Boss, Find Better Leadership
              </h1>

              <p className="max-w-[600px] text-gray-600 text-lg md:text-xl dark:text-gray-300">
                Discover what it's really like to work under different managers. Make informed career decisions with
                honest reviews from employees like you.
              </p>

              {/* Search Bar with subtle animation */}
              <div className="relative max-w-md w-full mt-2 transition-all duration-300 hover:scale-[1.01] focus-within:scale-[1.01]">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3.5 pl-12 pr-32 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Search for a company or manager..."
                />
                <Button className="absolute right-1.5 top-1.5 h-10 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300" size="sm">
                  Search
                </Button>
              </div>

              {/* Benefits with subtle hover effect */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-3">
                {BENEFITS.map((benefit, index) => (
                  <BenefitBadge key={index} {...benefit} />
                ))}
              </div>

              {/* Social proof */}
              {/* <div className="flex items-center gap-4 pt-2 text-gray-600 dark:text-gray-300 text-sm">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center font-medium text-xs`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span>Trusted by <strong>10,000+</strong> professionals worldwide</span>
              </div> */}
            </div>

            {/* Hero Right - Manager Profile Card with subtle animations */}
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
          </div>
        </div>
      </div>
      
      {/* Improved gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background/40 pointer-events-none z-0"></div>
  
    </section>
  )
}

export default Hero