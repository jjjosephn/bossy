import React from 'react'
import { Button } from '../button'
import { ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

const Testimonials = () => {
   return (
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
   )
}

export default Testimonials