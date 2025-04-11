"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, ArrowLeft, Loader2 } from "lucide-react"
import { Portal } from "@/components/ui/portal"
import type { Company } from "@/utils/search-types"

interface BossNotFoundFormProps {
  company: Company
  onClose: () => void
  onSubmit: (bossData: BossData) => Promise<void> | void
  isSubmitting?: boolean
}

export interface BossData {
  firstName: string
  lastName: string
  position: string
  companyId: string
}

const positionOptions = [
  { value: "team_lead", label: "Team Lead" },
  { value: "supervisor", label: "Supervisor" },
  { value: "manager", label: "Manager" },
  { value: "senior_manager", label: "Senior Manager" },
  { value: "director", label: "Director" },
  { value: "vice_president", label: "Vice President" },
  { value: "senior_vice_president", label: "Senior Vice President" },
  { value: "chief_officer", label: "Chief Officer" },
  { value: "president", label: "President" },
]

export function BossNotFoundForm({ company, onClose, onSubmit, isSubmitting = false }: BossNotFoundFormProps) {
  const [formData, setFormData] = useState<BossData>({
    firstName: "",
    lastName: "",
    position: "",
    companyId: company.id,
  })
  const [localSubmitting, setLocalSubmitting] = useState(false)
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    position: "",
  })

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const handleChange = (field: keyof BossData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: formData.firstName.trim() === "" ? "First name is required" : "",
      lastName: formData.lastName.trim() === "" ? "Last name is required" : "",
      position: formData.position === "" ? "Position is required" : "",
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setLocalSubmitting(true)
        // Wait for the submission to complete
        await onSubmit(formData)
        // Close the modal after successful submission
        onClose()
      } catch (error) {
        console.error("Error submitting form:", error)
      } finally {
        setLocalSubmitting(false)
      }
    }
  }

  // Stop propagation to prevent closing when clicking inside the modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Use either the prop or local submitting state
  const isCurrentlySubmitting = isSubmitting || localSubmitting

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div
          className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md overflow-hidden"
          onClick={handleModalClick}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                type="button"
                disabled={isCurrentlySubmitting}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold">Add Your Boss</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              type="button"
              disabled={isCurrentlySubmitting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Can't find your boss at <span className="font-medium text-foreground">{company.name}</span>? Add their
                details below.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="John"
                    className={errors.firstName ? "border-red-500" : ""}
                    disabled={isCurrentlySubmitting}
                  />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Doe"
                    className={errors.lastName ? "border-red-500" : ""}
                    disabled={isCurrentlySubmitting}
                  />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => handleChange("position", value)}
                  disabled={isCurrentlySubmitting}
                >
                  <SelectTrigger id="position" className={errors.position ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.position && <p className="text-xs text-red-500">{errors.position}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isCurrentlySubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCurrentlySubmitting}>
                {isCurrentlySubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Send Add Boss Request"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  )
}

