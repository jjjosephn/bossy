import { CheckCircle, Star, Users } from 'lucide-react'
import React from 'react'

type FeatureCardProps = {
   icon: React.ReactNode
   title: string
   description: string
}
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

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
   <div className="grid gap-3 text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
     <div className="flex justify-center">
       <div className="p-3 rounded-full bg-primary/10">{icon}</div>
     </div>
     <h3 className="text-xl font-bold">{title}</h3>
     <p className="text-gray-500 dark:text-gray-400">{description}</p>
   </div>
 )

const Features = () => {
   return (
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
   )
}

export default Features