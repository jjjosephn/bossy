import Link from "next/link"
import { ArrowRight, CheckCircle, Star, Users, Search, ChevronRight } from "lucide-react"
import { Button } from "../components/ui/button"

// Reusable components
const FeatureCard = ({ icon, title, description }) => (
  <div className="grid gap-3 text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex justify-center">
      <div className="p-3 rounded-full bg-primary/10">{icon}</div>
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400">{description}</p>
  </div>
)

const ReviewCard = ({ rating, monthsAgo }) => (
  <div className="space-y-2 rounded-md bg-white dark:bg-gray-800 p-3 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center">
      <div className="flex">
        {[...Array(5)].map((_, j) => (
          <Star
            key={j}
            className={`h-4 w-4 ${j < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
      <span className="ml-auto text-xs text-gray-500">
        {monthsAgo} month{monthsAgo > 1 ? "s" : ""} ago
      </span>
    </div>
    <div className="h-2 w-full rounded-full bg-muted-foreground/20" />
    <div className="h-2 w-4/5 rounded-full bg-muted-foreground/20" />
    {monthsAgo % 2 === 0 && <div className="h-2 w-3/5 rounded-full bg-muted-foreground/20" />}
  </div>
)

const BenefitBadge = ({ icon, text }) => (
  <div className="flex items-center gap-2 bg-primary/5 dark:bg-primary/10 rounded-full px-4 py-2">
    {icon}
    <span className="font-medium">{text}</span>
  </div>
)

// Constants
const FEATURES = [
  {
    title: "Anonymous Reviews",
    description: "Share your experiences without fear of repercussions. Your identity remains protected.",
    icon: <Users className="h-10 w-10 text-primary" />,
  },
  {
    title: "Detailed Ratings",
    description:
      "Rate managers across multiple categories including communication, support, and growth opportunities.",
    icon: <Star className="h-10 w-10 text-primary" />,
  },
  {
    title: "Company Insights",
    description:
      "Discover the management culture at different companies before accepting your next position.",
    icon: <CheckCircle className="h-10 w-10 text-primary" />,
  },
]

const SAMPLE_REVIEWS = [
  { rating: 4, monthsAgo: 1 },
  { rating: 5, monthsAgo: 2 },
  { rating: 3, monthsAgo: 3 },
  { rating: 4, monthsAgo: 4 },
]

const BENEFITS = [
  { text: "100% Anonymous", icon: <CheckCircle className="h-4 w-4 text-primary" /> },
  { text: "Free Access", icon: <CheckCircle className="h-4 w-4 text-primary" /> },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="w-36">
          {/* Empty div to balance the header */}
        </div>
        
        <Link className="flex items-center justify-center" href="#">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <Star className="h-6 w-6 text-white" />
          </div>
          <span className="ml-2 text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">Bossy</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href="#">Sign In</Link>
          </Button>
          <Button size="sm" className="rounded-full" asChild>
            <Link href="#">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
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
                  <Button variant="outline" className="rounded-full px-6 border-gray-300 hover:border-primary hover:bg-primary/5">
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

              {/* Hero Right - Manager Profile Card (unchanged) */}
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
                                className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 font-medium">4.0</span>
                        </div>
                        <div className="text-sm text-gray-500">Based on 28 reviews</div>
                      </div>
                      
                      {/* Reviews */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Recent Reviews</h4>
                          <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/90">
                            See all
                          </Button>
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

        {/* Features Section */}
        <section className="w-full pb-5 md:pb-20 lg:pb-24 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 text-transparent bg-clip-text">
                Rate. Review. Research.
              </h2>
              <p className="max-w-[800px] text-gray-600 md:text-lg dark:text-gray-300">
                Bossy helps you navigate workplace dynamics by providing insights into management styles and
                leadership qualities.
              </p>
            </div>
            
            {/* Feature Cards */}
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {FEATURES.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="w-full pb-2 md:pb-13 lg:pb-18 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">What Our Users Say</h2>
              <div className="w-16 h-1 bg-primary rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Bossy helped me find a manager who truly supports my career growth. Best career decision I've made.",
                  author: "Michael T.",
                  role: "Software Engineer"
                },
                {
                  quote: "I was able to avoid a toxic work environment thanks to the honest reviews on Bossy. Invaluable resource!",
                  author: "Jessica L.",
                  role: "Marketing Director"
                },
                {
                  quote: "As a manager, the feedback helped me improve my leadership style. It's a win-win for everyone.",
                  author: "Robert K.",
                  role: "Team Lead"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="inline-block h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 flex-grow mb-4 italic">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-16">
              <Button size="lg" className="px-8 py-6 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link href="#">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-3 sm:py-4 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">© 2024 Bossy. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-3 sm:gap-4">
          <Link className="text-[10px] sm:text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-[10px] sm:text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}