"use client"

import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { User, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import SideCard from "@/components/profile/SideCard"
import Content from "@/components/profile/Content"

export default function ProfilePage() {
   const { isLoaded, user } = useUser()
   const router = useRouter()

   useEffect(() => {
      if (isLoaded && !user) {
         router.push("/")
      }
   }, [isLoaded, user, router])

   if (!isLoaded) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-purple-600/5 dark:from-primary/5 dark:to-blue-400/5">
            <div className="animate-pulse flex flex-col items-center gap-4">
               <div className="h-24 w-24 bg-primary/20 rounded-full"></div>
               <div className="h-6 w-48 bg-primary/20 rounded"></div>
               <div className="h-4 w-32 bg-primary/20 rounded"></div>
            </div>
         </div>
      )
   }

   if (!user) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center bg-gradient-to-br from-primary/5 to-purple-600/5 dark:from-primary/5 dark:to-blue-400/5">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 dark:from-primary/20 dark:to-blue-400/20 flex items-center justify-center">
               <User className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">You need to be signed in to view this page</h1>
            <p className="text-muted-foreground max-w-md">Please sign in or create an account to access your profile page and personalized features.</p>
            <Link href="/">
               <Button className="gap-2 bg-gradient-to-br from-primary to-purple-600 dark:from-primary dark:to-blue-400 hover:opacity-90">
                  <Home className="h-4 w-4" />
                  Go back home
               </Button>
            </Link>
         </div>
      )
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-600/5 dark:from-primary/5 dark:to-blue-400/5 py-10 px-4">
         <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
               <div className="w-full md:w-1/3 flex flex-col gap-4">
                  <SideCard />
                  <Button 
                     className="gap-2 bg-gradient-to-br from-primary/50 to-purple-400/50 dark:from-primary/50 dark:to-blue-300/50" 
                     onClick={() => router.back()}
                  >
                     <ArrowLeft className="h-4 w-4" />
                     Back
                  </Button>
               </div>
               
               <div className="w-full md:w-2/3">
                  <Content />
               </div>
            </div>
         </div>
      </div>
   )
}