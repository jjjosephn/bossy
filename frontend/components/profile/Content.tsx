"use client"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Pencil, User, LinkIcon, Star, Building2, UserCheck } from "lucide-react"
import { useGetReviewsByUserIdQuery, useGetCompanyReviewsByUserIdQuery } from "@/app/state/api"
import Reviews from "./Reviews"
import CompanyReviews from "./CompanyReviews"

const Content = () => {
  const { user } = useUser()
  const { data: bossReviews = [], refetch: refetchBossReviews } = useGetReviewsByUserIdQuery(user?.id ?? "")
  const { data: companyReviews = [], refetch: refetchCompanyReviews } = useGetCompanyReviewsByUserIdQuery(user?.id ?? "")

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="w-full grid grid-cols-3 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1 rounded-lg">
        <TabsTrigger
          value="account"
          className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/50 data-[state=active]:to-purple-400/50 dark:data-[state=active]:from-primary dark:data-[state=active]:to-blue-300/50 data-[state=active]:text-white"
        >
          <User className="h-4 w-4" />
          Account
        </TabsTrigger>
        <TabsTrigger
          value="boss-reviews"
          onClick={() => {
            refetchBossReviews()
          }}
          className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/50 data-[state=active]:to-purple-400/50 dark:data-[state=active]:from-primary dark:data-[state=active]:to-blue-300/50 data-[state=active]:text-white"
        >
          <UserCheck className="h-4 w-4" />
          Boss Reviews
        </TabsTrigger>
        <TabsTrigger
          value="company-reviews"
          onClick={() => {
            refetchCompanyReviews()
          }}
          className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/50 data-[state=active]:to-purple-400/50 dark:data-[state=active]:from-primary dark:data-[state=active]:to-blue-300/50 data-[state=active]:text-white"
        >
          <Building2 className="h-4 w-4" />
          Company Reviews
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
                <p className="text-sm text-muted-foreground font-mono overflow-hidden text-ellipsis max-w-xs">
                  {user?.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="boss-reviews" className="space-y-6">
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Boss Reviews
                </CardTitle>
                <CardDescription>Reviews you've written about your bosses and managers.</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                {bossReviews.length} review{bossReviews.length !== 1 ? 's' : ''}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Reviews reviews={bossReviews} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="company-reviews" className="space-y-6">
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Company Reviews
                </CardTitle>
                <CardDescription>Reviews you've written about companies you've worked for.</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                {companyReviews.length} review{companyReviews.length !== 1 ? 's' : ''}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CompanyReviews reviews={companyReviews} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default Content