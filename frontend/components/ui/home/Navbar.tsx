import React from 'react'
import { Button } from '../button'
import Link from 'next/link'
import { Star } from 'lucide-react'

const Navbar = () => {
   return (
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
         <div className="w-36">
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
   )
}

export default Navbar