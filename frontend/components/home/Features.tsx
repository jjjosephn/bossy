"use client"

import { SignUpButton, useUser } from "@clerk/nextjs"
import { ArrowRight, CheckCircle, Star, Users } from "lucide-react"
import type React from "react"
import { Button } from "../ui/button"

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
    description: "Rate managers across multiple categories including communication, support, and growth opportunities.",
    icon: <Star className="h-10 w-10 text-primary" />,
  },
  {
    title: "Company Insights",
    description: "Discover the management culture at different companies before accepting your next position.",
    icon: <CheckCircle className="h-10 w-10 text-primary" />,
  },
]

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-xl p-8 text-center transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-primary/20">
    <div className="mb-6">
      <div className="p-4 rounded-full bg-primary/10 ring-4 ring-primary/5">{icon}</div>
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400">{description}</p>
  </div>
)

const Features = () => {
  const { isSignedIn } = useUser()
  return (
    <section className="w-full min-h-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <div className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 animate-gradientShift text-transparent bg-clip-text max-w-3xl">
            Rate. Review. Research.
          </h2>
          <p className="max-w-[800px] text-gray-600 md:text-xl dark:text-gray-300">
            Bossy helps you navigate workplace dynamics by providing insights into management styles and leadership
            qualities.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto grid max-w-5xl gap-8 py-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        <div className="flex justify-center mb-12">
          {!isSignedIn ? (
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-medium rounded-full shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                asChild
              >
                <span>
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </SignUpButton>
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  )
}

export default Features

