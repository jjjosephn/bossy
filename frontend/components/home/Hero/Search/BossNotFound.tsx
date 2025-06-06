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
import { useAddBossRequestMutation, useGetCompanyByMapboxIdQuery } from "@/app/state/api"
import { useUser } from "@clerk/nextjs"

interface BossNotFoundFormProps {
  company: Company
  onClose: () => void
  isSubmitting?: boolean
  onSubmitSuccess?: () => void
}

export interface PendingBossData {
  userId: string
  bossFirstName: string
  bossLastName: string
  position: string
  companyId: string
}

const positionOptions = [
  { value: "Team Lead", label: "Team Lead" },
  { value: "Supervisor", label: "Supervisor" },
  { value: "Manager", label: "Manager" },
  { value: "Senior Manager", label: "Senior Manager" },
  { value: "Director", label: "Director" },
  { value: "Vice President", label: "Vice President" },
  { value: "Senior Vice President", label: "Senior Vice President" },
  { value: "Chief Officer", label: "Chief Officer" },
  { value: "President", label: "President" },
]

export function BossNotFoundForm({ company, onClose, isSubmitting = false, onSubmitSuccess }: BossNotFoundFormProps) {
  const { user } = useUser()
  const { data: companyInfo } = useGetCompanyByMapboxIdQuery(company.mapboxId)
  const [addBossRequest] = useAddBossRequestMutation()
  const [formData, setFormData] = useState<PendingBossData>({
    userId: user?.id || "",
    bossFirstName: "",
    bossLastName: "",
    position: "",
    companyId: "",
  })
  const [localSubmitting, setLocalSubmitting] = useState(false)
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    position: "",
  })

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const handleChange = (field: keyof PendingBossData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: formData.bossFirstName.trim() === "" ? "First name is required" : "",
      lastName: formData.bossLastName.trim() === "" ? "Last name is required" : "",
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
        await addBossRequest(formData)
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        onClose()
      } catch (error) {
        console.error("Error submitting form:", error)
      } finally {
        setLocalSubmitting(false)
      }
    }
  }

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const isCurrentlySubmitting = isSubmitting || localSubmitting

  useEffect(() => {
    if (companyInfo?.companyId) {
      setFormData((prev) => ({
        ...prev,
        companyId: companyInfo.companyId,
      }))
    }
  }, [companyInfo?.companyId])

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
                Can&apos;t find your boss at <span className="font-medium text-foreground">{company.name}</span>? Add
                their details below.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.bossFirstName}
                    onChange={(e) => handleChange("bossFirstName", e.target.value)}
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
                    value={formData.bossLastName}
                    onChange={(e) => handleChange("bossLastName", e.target.value)}
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