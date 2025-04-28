"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { ShieldAlert, MessageSquare } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2 } from "lucide-react"
import PendingTabs from "@/components/admin/PendingTab"
import HistoryTabs from "@/components/admin/HistoryTab"
import ReviewPendingTab from "@/components/admin/ReviewPendingTab"
import ReviewHistoryTab from "@/components/admin/ReviewHistoryTab"
import { useGetArchivedFormsQuery, useGetPendingBossesQuery } from "../state/api"

// Mock hooks for review counts - replace with your actual API hooks
const useMockPendingReviewsCount = () => {
  return { data: 2 }
}

const useMockArchivedReviewsCount = () => {
  return { data: 2 }
}

const AdminPanel = () => {
  const { user } = useUser()
  const { data: pendingRequests = [], refetch: refetchPending } = useGetPendingBossesQuery()
  const { data: archivedForms = [], refetch: refetchArchived } = useGetArchivedFormsQuery()
  const [activeTab, setActiveTab] = useState("pending")
  const [activeReviewTab, setActiveReviewTab] = useState("pending")

  // Mock review counts - replace with your actual API calls
  const { data: pendingReviewsCount = 0 } = useMockPendingReviewsCount()
  const { data: archivedReviewsCount = 0 } = useMockArchivedReviewsCount()

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-2 mb-6">
        <ShieldAlert className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <h2 className="text-xl font-semibold mb-4">Boss Verification</h2>
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
          if (value === "pending") {
            refetchPending()
          } else if (value === "history") {
            refetchArchived()
          }
        }}
      >
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
              {archivedForms.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingTabs />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTabs />
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Review Moderation</h2>
      </div>

      <Tabs
        value={activeReviewTab}
        onValueChange={(value) => {
          setActiveReviewTab(value)
          // Add refetch logic here when you implement the actual API
        }}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Reviews
            <Badge variant="secondary" className="ml-1">
              {pendingReviewsCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Review History
            <Badge variant="secondary" className="ml-1">
              {archivedReviewsCount}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <ReviewPendingTab />
        </TabsContent>

        <TabsContent value="history">
          <ReviewHistoryTab />
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <div className="text-sm text-muted-foreground">
        <p>Admin access granted to: {user?.primaryEmailAddress?.emailAddress}</p>
      </div>
    </div>
  )
}

export default AdminPanel
