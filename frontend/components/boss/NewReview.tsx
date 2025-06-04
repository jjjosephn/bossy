import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenLine } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import BossReviewForm from "@/components/boss/BossReviewForm"
import { useNewBossReviewMutation, useGetBossReviewsQuery } from "@/app/state/api"
import { useParams } from "next/navigation"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface NewReviewProps {
  reviewText: string
  rating: number
  term: string
  userId?: string
  bossId: string
}

export function NewReview() {
  const [open, setOpen] = useState(false)
  const { bossId } = useParams<{ bossId: string }>()
  const [newReview] = useNewBossReviewMutation()
  const { refetch: refetchReviews } = useGetBossReviewsQuery(bossId as string)
  

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
          <BossReviewForm 
            onSubmit={handleSubmit} 
            onCancel={() => setOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </CardContent>
  )
}