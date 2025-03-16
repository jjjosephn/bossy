import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenLine } from "lucide-react"

export function NewReview() {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-purple-600/5 dark:from-primary/5 dark:to-blue-400/5 border border-primary/10 shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent mb-2">Share Your Experience</h3>
          <p className="text-sm text-muted-foreground">Help others make informed decisions</p>
        </div>
        
        <Button 
          size="lg" 
          className="w-full bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 hover:opacity-90 transition-opacity font-medium"
        >
          <PenLine className="h-4 w-4 mr-2" />
          Write a Review
        </Button>
      </CardContent>
    </Card>
  )
}