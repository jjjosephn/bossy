"use client"

import type React from "react"
import { Star } from "lucide-react"

import RightSection from "./Hero/RightSection"
import BenefitBadges from "./Hero/BenefitBadges"
import SearchComponent from "./Hero/SearchComponent"

const Hero = () => {
  return (
    <section className="w-full pb-12 md:pb-24 lg:pb-32 pt-6 md:pt-20 lg:pt-24 relative bg-gradient-to-b from-gray-300 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
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

              {/* Two-step Search Component */}
              <SearchComponent />

              <BenefitBadges />
            </div>

            <RightSection />
          </div>
        </div>
      </div>

      {/* Improved gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background/40 pointer-events-none z-0"></div>
    </section>
  )
}

export default Hero

