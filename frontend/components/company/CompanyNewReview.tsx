import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenLine } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import CompanyReviewForm from "@/components/company/CompanyReviewForm"
import { useGetBossReviewsQuery, useGetCompanyReviewsQuery, useNewCompanyReviewMutation } from "@/app/state/api"
import { useParams } from "next/navigation"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface NewReviewProps {
  reviewText: string
  rating: number
  term: string
  userId?: string
  companyId: string
}

export function CompanyNewReview() {
  const [open, setOpen] = useState(false)
  const { mapboxId } = useParams()
  const [newReview] = useNewCompanyReviewMutation()
  const { refetch: refetchReviews } = useGetCompanyReviewsQuery(mapboxId as string)
  

  const handleSubmit = async (data: NewReviewProps) => {
    try {
      await newReview(data).unwrap()
      refetchReviews()
      toast.success("Your review has been submitted for approval.")
    } catch (error) {
      console.error("Failed to create review:", error)
    }
    setOpen(false)
  }

  return (
    <CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 hover:opacity-90 transition-opacity font-medium"
          onClick={() => setOpen(true)}
        >
          <PenLine className="h-4 w-4 mr-2" />
          <DialogTitle>Write a Review</DialogTitle>
        </Button>
        <DialogContent className="sm:max-w-[550px]">
          <CompanyReviewForm 
            onSubmit={handleSubmit} 
            onCancel={() => setOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </CardContent>
  )
}