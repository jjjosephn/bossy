"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { ShieldAlert } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2 } from 'lucide-react'
import PendingTabs, { type Request, type ProcessedRequest } from "@/components/admin/PendingTab"
import HistoryTabs from "@/components/admin/HistoryTab"
import { useGetPendingBossesQuery } from "../state/api"

const AdminPanel = () => {
   const { user } = useUser()
   const {data: pendingRequests = []} = useGetPendingBossesQuery()
   const [historyRequests, setHistoryRequests] = useState<ProcessedRequest[]>([])
   const [activeTab, setActiveTab] = useState("pending")

   console.log("Pending Requests: ", pendingRequests)
   return (
      <div className="container mx-auto p-6 max-w-6xl">
         <div className="flex items-center gap-2 mb-6">
         <ShieldAlert className="h-6 w-6 text-primary" />
         <h1 className="text-2xl font-bold">Admin Panel</h1>
         </div>

         <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
               <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending Requests
                  <Badge variant="secondary" className="ml-1">
                  {pendingRequests.length}
                  </Badge>
               </TabsTrigger>
               <TabsTrigger value="history" className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Request History
                  <Badge variant="secondary" className="ml-1">
                  {historyRequests.length}
                  </Badge>
               </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
               <PendingTabs />
            </TabsContent>

            <TabsContent value="history">
               <HistoryTabs historyRequests={historyRequests} />
            </TabsContent>
         </Tabs>

         <Separator className="my-6" />

         <div className="text-sm text-muted-foreground">
         <p>Admin access granted to: {user?.primaryEmailAddress?.emailAddress}</p>
         </div>
      </div>
   )
}

export default AdminPanel