import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight, Star, Quote } from 'lucide-react'
import Link from 'next/link'
import { SignUp, SignUpButton } from '@clerk/nextjs'

type TestimonialCardProps = {
   quote: string
   author: string
   role: string
   index: number
}

const TestimonialCard = ({ quote, author, role, index }: TestimonialCardProps) => (
   <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 relative flex flex-col h-full">
      <div className="absolute -top-3 -left-3 bg-primary/10 rounded-full p-2">
         <Quote className="h-6 w-6 text-primary" />
      </div>
      <div className="mb-6 flex">
         {[...Array(5)].map((_, i) => (
         <Star 
            key={i} 
            className={`h-5 w-5 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
         />
         ))}
      </div>
      <p className="text-gray-600 dark:text-gray-300 flex-grow mb-6 text-lg italic">"{quote}"</p>
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
         <p className="font-bold text-gray-800 dark:text-white">{author}</p>
         <p className="text-sm text-primary">{role}</p>
      </div>
   </div>
   )

   const Testimonials = () => {
   const testimonials = [
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
   ]

   return (
      <section className="w-full min-h-full flex items-center justify-center py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
         <div className="container px-4 md:px-6 mx-auto">
         <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary mb-6">
               Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 animate-gradientShift text-transparent bg-clip-text mb-6 max-w-2xl">
               What Our Users Say
            </h2>
            <p className="max-w-xl text-gray-600 dark:text-gray-300 text-lg mb-6">
               Join thousands of professionals who have found better work environments through Bossy
            </p>
            <div className="w-24 h-1 bg-primary rounded-full"></div>
         </div>

         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
               <TestimonialCard key={index} {...testimonial} index={index} />
            ))}
         </div>
         
         <div className="flex justify-center mt-16">
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
         </div>
         </div>
      </section>
   )
}

export default Testimonials