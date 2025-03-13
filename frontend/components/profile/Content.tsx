import React from 'react'
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Pencil, User, LinkIcon, Star } from "lucide-react"

const Content = () => {
   const { user } = useUser()
   return (
      <Tabs defaultValue="account" className="w-full">
         <TabsList className="w-full grid grid-cols-2 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger 
               value="account" 
               className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/50 data-[state=active]:to-purple-400/50 dark:data-[state=active]:from-primary dark:data-[state=active]:to-blue-300/50 data-[state=active]:text-white"
            >
               <User className="h-4 w-4" />
               Account
            </TabsTrigger>
            <TabsTrigger 
               value="reviews" 
               className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/50 data-[state=active]:to-purple-400/50 dark:data-[state=active]:from-primary dark:data-[state=active]:to-blue-300/50 data-[state=active]:text-white"
            >
               <Star className="h-4 w-4" />
               Reviews
            </TabsTrigger>
         </TabsList>

         <TabsContent value="account" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Manage your account details and personal information.</CardDescription>
                     </div>
                     <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 dark:from-primary/20 dark:to-blue-400/20 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-2">
                     <h3 className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Full Name
                     </h3>
                     <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-br from-primary/5 to-purple-600/5 dark:from-primary/5 dark:to-blue-400/5">
                        <p className="text-sm">
                           {user?.firstName} {user?.lastName}
                        </p>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 text-primary">
                           <Pencil className="h-3.5 w-3.5" />
                        </Button>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email Address
                     </h3>
                     <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-br from-primary/5 to-purple-600/5 dark:from-primary/5 dark:to-blue-400/5">
                        <p className="text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 text-primary">
                           <Pencil className="h-3.5 w-3.5" />
                        </Button>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-sm font-medium flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-primary" />
                        Account ID
                     </h3>
                     <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-br from-primary/5 to-purple-600/5 dark:from-primary/5 dark:to-blue-400/5">
                        <p className="text-sm text-muted-foreground font-mono text-xs overflow-hidden text-ellipsis max-w-xs">
                           {user?.id}
                        </p>
                     </div>
                  </div>
               </CardContent>
               <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10 text-primary">
                     <Pencil className="h-3.5 w-3.5" />
                     Update Information
                  </Button>
                  <Button size="sm" className="bg-gradient-to-br from-primary/50 to-purple-400/50 dark:from-primary/50 dark:to-blue-300/50 hover:opacity-90">
                     Save Changes
                  </Button>
               </CardFooter>
            </Card>
         </TabsContent>

         <TabsContent value="reviews">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle>Your Reviews</CardTitle>
                        <CardDescription>View the reviews you've left.</CardDescription>
                     </div>
                     <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 dark:from-primary/20 dark:to-blue-400/20 flex items-center justify-center">
                        <Star className="h-6 w-6 text-primary" />
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="py-10">
                  <div className="flex flex-col items-center justify-center text-center gap-4">
                     <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/10 to-purple-600/10 dark:from-primary/10 dark:to-blue-400/10 flex items-center justify-center">
                        <Star className="h-10 w-10 text-primary" />
                     </div>
                     <h3 className="text-lg font-medium">No Reviews Yet</h3>
                     <p className="text-sm text-muted-foreground max-w-md">
                        You haven't written any reviews yet. Your reviews will appear here once you start sharing your
                        experiences.
                     </p>
                     <Button className="mt-2 bg-gradient-to-br from-primary/50 to-purple-400/50 dark:from-primary/50 dark:to-blue-300/50 hover:opacity-90">
                        Write Your First Review
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>
   )
}

export default Content