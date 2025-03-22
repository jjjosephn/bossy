"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { useUser } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

// Types for our data
export type Company = {
  name: string
  address: string
}

export type Request = {
  id: string
  firstName: string
  lastName: string
  position: string
  requestDate: string
  companyId: string
  company: Company
}

export type ProcessedRequest = Request & {
  status: "accepted" | "denied"
  processedDate: string
}

// Generate mock data sorted by date (newest first)
export const generateMockRequests = (count: number): Request[] => {
  return Array.from({ length: count }, (_, i) => {
    // Create date with most recent ones first
    const daysAgo = Math.floor(Math.random() * 30)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    return {
      id: `${i + 1}`,
      firstName: `First${i + 1}`,
      lastName: `Last${i + 1}`,
      position: ["Manager", "Team Lead", "Director", "Supervisor"][Math.floor(Math.random() * 4)],
      requestDate: date.toISOString().split("T")[0],
      companyId: `comp-${Math.floor(i / 10) + 1}`,
      company: {
        name: `Company ${Math.floor(i / 10) + 1}`,
        address: `${Math.floor(Math.random() * 1000) + 1} Main St, City ${Math.floor(i / 10) + 1}, State`,
      },
    }
  }).sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime())
}

interface PendingTabsProps {
  pendingRequests: Request[]
  processingIds: string[]
  onRequestAction: (request: Request, action: "accept" | "deny") => Promise<void>
}

const PendingTabs = ({ pendingRequests, processingIds, onRequestAction }: PendingTabsProps) => {
  const { user, isLoaded } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [currentPendingPage, setCurrentPendingPage] = useState(1)
  const router = useRouter()

  const requestsPerPage = 10
  const isAdmin = user?.publicMetadata.role === "admin"

  // Calculate pagination values for pending requests
  const totalPendingPages = Math.ceil(pendingRequests.length / requestsPerPage)
  const pendingIndexOfLastRequest = currentPendingPage * requestsPerPage
  const pendingIndexOfFirstRequest = pendingIndexOfLastRequest - requestsPerPage
  const currentPendingRequests = pendingRequests.slice(pendingIndexOfFirstRequest, pendingIndexOfLastRequest)

  useEffect(() => {
    if (isLoaded) {
      if (!isAdmin) {
        router.push("/")
      } else {
        setTimeout(() => setIsLoading(false), 800)
      }
    }
  }, [isAdmin, router, isLoaded])

  // Reset to first page when pending requests change
  useEffect(() => {
    setCurrentPendingPage(1)
  }, [pendingRequests.length])

  // Show skeleton while checking admin status
  if (isLoading || !isLoaded) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>

        <Skeleton className="h-10 w-full mb-6" />
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <TabsContent value="pending">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Pending Manager Requests</CardTitle>
              <CardDescription>Review and process pending manager access requests</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="whitespace-nowrap">
                {pendingRequests.length} pending
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No pending requests to display</div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.firstName} {request.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.position}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{request.company.name}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {request.company.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{request.requestDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => onRequestAction(request, "deny")}
                            disabled={processingIds.includes(request.id)}
                          >
                            {processingIds.includes(request.id) ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <X className="h-4 w-4 mr-1" />
                            )}
                            Deny
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onRequestAction(request, "accept")}
                            disabled={processingIds.includes(request.id)}
                          >
                            {processingIds.includes(request.id) ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <Check className="h-4 w-4 mr-1" />
                            )}
                            Accept
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination controls for pending */}
          {pendingRequests.length > requestsPerPage && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {pendingIndexOfFirstRequest + 1}-{Math.min(pendingIndexOfLastRequest, pendingRequests.length)}{" "}
                of {pendingRequests.length}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPendingPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPendingPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm mx-2">
                  Page {currentPendingPage} of {totalPendingPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPendingPage((prev) => Math.min(prev + 1, totalPendingPages))}
                  disabled={currentPendingPage === totalPendingPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default PendingTabs

