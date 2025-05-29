"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useParams } from "next/navigation"
import { useGetCompanyByMapboxIdQuery } from "@/app/state/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@clerk/nextjs"

interface CompanyReviewFormProps {
  onSubmit?: (data: any) => void
  onCancel?: () => void
}

const formSchema = z.object({
  reviewText: z.string().min(10, {
    message: "Review must be at least 10 characters.",
  }),
  rating: z
    .number()
    .min(1, {
      message: "Please select a rating.",
    })
    .max(5),
  userId: z.string().optional(),
  term: z.string({
    required_error: "Please select how long you worked with this boss.",
  })
  .min(1, { message: "Please select how long you worked with this boss." }),
})

const termOptions = [
  { value: "<1", label: "Less than 1 year" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5+", label: "5+ years" },
]

export default function CompanyReviewForm({ onSubmit, onCancel }: CompanyReviewFormProps) {
  const { mapboxId } = useParams()
  const { data: company } = useGetCompanyByMapboxIdQuery(mapboxId as string)
  const { user } = useUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewText: "",
      rating: 0,
      term: "",
      userId: user?.id,
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit?.({
      ...values,
      companyId: company?.companyId
    })
  }

  return (
    <Card className="w-full max-w-lg border-0 shadow-none">
      <CardHeader>
        <CardTitle>Submit Company Review</CardTitle>
        <CardDescription>Share your experience working at {company?.companyName}</CardDescription>
      </CardHeader>

      {company && (
        <CardContent className="">
          <div className="font-medium text-lg">
            {company?.companyName}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{company.fullAddress}</div>
        </CardContent>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How long did you work at {company?.companyName}?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {termOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 cursor-pointer ${
                            field.value >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                          onClick={() => form.setValue("rating", star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reviewText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Share your experience working at ${company?.companyName}...`}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Be honest but professional in your feedback</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 hover:opacity-90 transition-opacity font-medium"
            >
              Submit Review
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
