import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { CalendarDays, Mail, Pencil } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useUser } from '@clerk/nextjs'
import { useGetReviewsByUserIdQuery } from '@/app/state/api'


const SideCard = () => {
   const { user } = useUser()
   const { data: reviews } = useGetReviewsByUserIdQuery(user?.id ?? "")
   
   const createdDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
   }) : "N/A"

   return (
      <Card className="md:col-span-1 overflow-hidden border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
         <div className="h-32 bg-gradient-to-br from-primary/50 to-purple-400/50 dark:from-primary/50 dark:to-blue-300/50"></div>
         <CardHeader className="flex flex-col items-center text-center pt-0 relative">
            <Avatar className="h-24 w-24 border-4 border-background mt-[-3rem] ring-2 ring-primary shadow-lg">
               <AvatarImage src={user?.imageUrl} alt={`${user?.firstName} ${user?.lastName}`} />
               <AvatarFallback className="text-xl bg-gradient-to-br from-primary/50 to-purple-400/50 dark:from-primary/50 dark:to-blue-300/50 text-white">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
               </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4 text-2xl">{user?.firstName} {user?.lastName}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-1 mt-1">
               <Mail className="h-4 w-4" />
               {user?.primaryEmailAddress?.emailAddress}
            </CardDescription>
         </CardHeader>
         <CardContent>
            <div className="space-y-4 mt-2">
               <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-purple-400/5 dark:from-primary/5 dark:to-blue-300/5">
                  <div className="flex items-center gap-3 justify-center">
                     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-purple-400/10 dark:from-primary/10 dark:to-blue-300/50 flex items-center justify-center">
                        <CalendarDays className="h-5 w-5 text-primary" />
                     </div>
                     <div>
                        <p className="text-xs text-muted-foreground">Joined</p>
                        <p className="text-sm font-medium">{createdDate}</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 items-center justify-center">
               <Badge variant="outline" className="text-xs border-primary/20">
                  {reviews?.length} Reviews
               </Badge>
            </div>
         </CardContent>
      </Card>
   )
}

export default SideCard