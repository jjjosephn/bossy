"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useGetArchivedFormsQuery } from "@/app/state/api"
import { formatDate } from "@/utils/date-utils"

export type ArchivedFormsProps = {
  archiveId: string
  bossFirstName: string
  bossLastName: string
  position: string
  timestamp: string
  companyId: string
  requestedDate: string
  status: "accepted" | "declined"
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

const HistoryTabs = () => {
  const { data: archivedFormsRaw = [] } = useGetArchivedFormsQuery()
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1)
  const requestsPerPage = 10
  const archivedForms = [...archivedFormsRaw].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
  const totalHistoryPages = Math.ceil(archivedForms.length / requestsPerPage)
  const historyIndexOfLastRequest = currentHistoryPage * requestsPerPage
  const historyIndexOfFirstRequest = historyIndexOfLastRequest - requestsPerPage
  const currentHistoryRequests = archivedForms.slice(historyIndexOfFirstRequest, historyIndexOfLastRequest)
  

  useEffect(() => {
    setCurrentHistoryPage(1)
  }, [archivedForms.length])

  return (
    <TabsContent value="history">
      <Tabs>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Request History</CardTitle>
                <CardDescription>View history of processed manager access requests</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="whitespace-nowrap">
                  {archivedForms.length} processed
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {archivedForms.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No request history to display</div>
            ) : (
              <div className="border rounded-md overflow-x-auto">
                <Table className="w-full table-auto">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/5">Requester</TableHead>
                      <TableHead className="w-1/5">Boss</TableHead>
                      <TableHead className="w-2/5">Company</TableHead>
                      <TableHead className="w-1/10">Request Date</TableHead>
                      <TableHead className="w-1/10">Status</TableHead>
                      <TableHead className="w-1/10">Processed Date</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {currentHistoryRequests.map((request) => (
                      <TableRow key={request.archiveId ?? `${request.User.userId}-${request.timestamp}`}>
                        <TableCell className="align-top">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {request.User.firstName} {request.User.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground break-words">{request.User.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {request.bossFirstName} {request.bossLastName}
                            </span>
                            <span className="text-xs text-muted-foreground">{request.position}</span>
                          </div>
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
                          {formatDate(request.requestedDate)}
                        </TableCell>
                        <TableCell className="align-top">
                          {request.status === "accepted" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Accepted
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" /> Declined
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground align-top whitespace-nowrap">
                          {formatDate(request.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination controls */}
            {archivedForms.length > requestsPerPage && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {historyIndexOfFirstRequest + 1}-{Math.min(historyIndexOfLastRequest, archivedForms.length)}{" "}
                  of {archivedForms.length}
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
      </Tabs>
    </TabsContent>
  )
}

export default HistoryTabs
