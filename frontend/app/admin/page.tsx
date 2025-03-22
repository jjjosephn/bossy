"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { ShieldAlert } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2 } from 'lucide-react'
import PendingTabs, { type Request, type ProcessedRequest, generateMockRequests } from "@/components/admin/PendingTab"
import HistoryTabs from "@/components/admin/HistoryTab"

const AdminPanel = () => {
   const { user } = useUser()
   const [pendingRequests, setPendingRequests] = useState<Request[]>(generateMockRequests(30))
   const [historyRequests, setHistoryRequests] = useState<ProcessedRequest[]>([])
   const [processingIds, setProcessingIds] = useState<string[]>([])
   const [activeTab, setActiveTab] = useState("pending")

   const handleRequestAction = async (request: Request, action: "accept" | "deny") => {
      try {
         // Add to processing state to show loading indicator
         setProcessingIds((prev) => [...prev, request.id])

         // Simulate API call delay
         await new Promise((resolve) => setTimeout(resolve, 800))

         // Here you would make API calls to your database
         // 1. Remove from pendingBosses
         // 2. Add to deletedPendingBosses
         // 3. If accepted, add to managers collection

         // Create a processed request record
         const processedRequest: ProcessedRequest = {
         ...request,
         status: action === "accept" ? "accepted" : "denied",
         processedDate: new Date().toISOString().split("T")[0],
         }

         // Add to history
         setHistoryRequests((prev) => [processedRequest, ...prev])

         // Remove from pending
         setPendingRequests((prev) => prev.filter((r) => r.id !== request.id))

         console.log(`Request ${request.id} ${action === "accept" ? "accepted" : "denied"}`)
      } catch (error) {
         console.error("Error processing request:", error)
      } finally {
         // Remove from processing state
         setProcessingIds((prev) => prev.filter((pid) => pid !== request.id))
      }
   }

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
               <PendingTabs
                  pendingRequests={pendingRequests}
                  processingIds={processingIds}
                  onRequestAction={handleRequestAction}
               />
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