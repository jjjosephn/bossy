"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
  useAcceptPendingBossRequestMutation,
  useDeclinePendingBossRequestMutation,
  useGetPendingBossesQuery,
} from "@/app/state/api"
import { formatDate } from "@/utils/date-utils"
import { toast } from "react-toastify"


export type Request = {
  pendingId: string
  bossFirstName: string
  bossLastName: string
  position: string
  timestamp: string
  companyId: string
  Company: {
    companyName: string
    fullAddress: string
  }
  User: {
    firstName: string
    lastName: string
    email: string
    userId: string
  }
}

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string): string => {
  if (!string) return string
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const PendingTabs = () => {
  const { user, isLoaded } = useUser()
  const [currentPendingPage, setCurrentPendingPage] = useState(1)
  const { data: pendingRequests = [], refetch } = useGetPendingBossesQuery()
  const [acceptRequest, { isLoading: isAccepting }] = useAcceptPendingBossRequestMutation()
  const [declineRequest, { isLoading: isDeclining }] = useDeclinePendingBossRequestMutation()
  const [processingIds, setProcessingIds] = useState<string[]>([])
  const router = useRouter()

  const requestsPerPage = 10
  const isAdmin = user?.publicMetadata.role === "admin"

  const totalPendingPages = Math.ceil(pendingRequests.length / requestsPerPage)
  const pendingIndexOfLastRequest = currentPendingPage * requestsPerPage
  const pendingIndexOfFirstRequest = pendingIndexOfLastRequest - requestsPerPage
  const currentPendingRequests = pendingRequests.slice(pendingIndexOfFirstRequest, pendingIndexOfLastRequest)

  useEffect(() => {
    if (isLoaded) {
      if (!isAdmin) {
        router.push("/")
      } 
    }
  }, [isAdmin, router, isLoaded])

  useEffect(() => {
    setCurrentPendingPage(1)
  }, [pendingRequests.length])


  const handleAcceptRequest = async (request: Request) => {
    try {
      setProcessingIds((prev) => [...prev, request.pendingId])
      const capitalizedFirstName = capitalizeFirstLetter(request.bossFirstName)
      const capitalizedLastName = capitalizeFirstLetter(request.bossLastName)

      await acceptRequest({
        pendingId: request.pendingId,
        userId: request.User.userId,
        companyId: request.companyId,
        bossFirstName: capitalizedFirstName,
        bossLastName: capitalizedLastName,
        position: request.position,
        status: "accepted",
        requestedDate: request.timestamp,
      }).unwrap()
      toast.success(`Successfully accepted manager request`)
      refetch()
    } catch (error) {
      console.error("Error accepting request:", error)
      toast.error("Failed to accept manager request")
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== request.pendingId))
    }
  }

  const handleDeclineRequest = async (request: Request) => {
    try {
      setProcessingIds((prev) => [...prev, request.pendingId])
      const capitalizedFirstName = capitalizeFirstLetter(request.bossFirstName)
      const capitalizedLastName = capitalizeFirstLetter(request.bossLastName)

      await declineRequest({
        pendingId: request.pendingId,
        userId: request.User.userId,
        companyId: request.companyId,
        bossFirstName: capitalizedFirstName,
        bossLastName: capitalizedLastName,
        position: request.position,
        status: "declined",
        requestedDate: request.timestamp,
      }).unwrap()
      toast.success(`Successfully declined manager request`)
      refetch()
    } catch (error) {
      console.error("Error declining request:", error)
      toast.error("Failed to decline manager request")
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== request.pendingId))
    }
  }

  return (
    <TabsContent value="pending">
      <Tabs>
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
              <div className="border rounded-md overflow-x-auto">
                <Table className="w-full table-auto">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/5">Requester</TableHead>
                      <TableHead className="w-1/5">Boss</TableHead>
                      <TableHead className="w-2/5">Company</TableHead>
                      <TableHead className="w-1/10">Date Requested</TableHead>
                      <TableHead className="w-1/10 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {currentPendingRequests.map((request) => (
                      <TableRow key={request.pendingId}>
                        <TableCell className="align-top">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {request.User.firstName} {request.User.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground break-words">{request.User.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          {request.pendingId ? (
                            <div className="flex flex-col">
                              <span className="text-sm">
                                {request.bossFirstName} {request.bossLastName}
                              </span>
                              <span className="text-xs text-muted-foreground">{request.position}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not specified</span>
                          )}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex flex-col">
                            <span className="text-sm">{request.Company.companyName}</span>
                            <span className="text-xs text-muted-foreground break-words">
                              {request.Company.fullAddress}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground align-top whitespace-nowrap">
                          {formatDate(request.timestamp)}
                        </TableCell>
                        <TableCell className="text-right align-top">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleDeclineRequest(request)}
                              disabled={processingIds.includes(request.pendingId)}
                            >
                              {processingIds.includes(request.pendingId) && isDeclining ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <X className="h-4 w-4 mr-1" />
                              )}
                              Deny
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRequest(request)}
                              disabled={processingIds.includes(request.pendingId)}
                            >
                              {processingIds.includes(request.pendingId) && isAccepting ? (
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
      </Tabs>
    </TabsContent>
  )
}

export default PendingTabs
