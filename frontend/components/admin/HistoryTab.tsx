"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import type { ProcessedRequest } from "./PendingTab"

interface HistoryTabsProps {
  historyRequests: ProcessedRequest[]
}

const HistoryTabs = ({ historyRequests }: HistoryTabsProps) => {
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1)
  const requestsPerPage = 10

  // Calculate pagination values for history
  const totalHistoryPages = Math.ceil(historyRequests.length / requestsPerPage)
  const historyIndexOfLastRequest = currentHistoryPage * requestsPerPage
  const historyIndexOfFirstRequest = historyIndexOfLastRequest - requestsPerPage
  const currentHistoryRequests = historyRequests.slice(historyIndexOfFirstRequest, historyIndexOfLastRequest)

  // Reset to first page when history requests change
  useEffect(() => {
    setCurrentHistoryPage(1)
  }, [historyRequests.length])

  return (
    <Tabs value="history">
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Request History</CardTitle>
                <CardDescription>View history of processed manager access requests</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="whitespace-nowrap">
                  {historyRequests.length} processed
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {historyRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No request history to display</div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Processed Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentHistoryRequests.map((request) => (
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
                        <TableCell>
                          {request.status === "accepted" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Accepted
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" /> Denied
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{request.processedDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination controls for history */}
            {historyRequests.length > requestsPerPage && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {historyIndexOfFirstRequest + 1}-{Math.min(historyIndexOfLastRequest, historyRequests.length)}{" "}
                  of {historyRequests.length}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentHistoryPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentHistoryPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm mx-2">
                    Page {currentHistoryPage} of {totalHistoryPages}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentHistoryPage((prev) => Math.min(prev + 1, totalHistoryPages))}
                    disabled={currentHistoryPage === totalHistoryPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default HistoryTabs

