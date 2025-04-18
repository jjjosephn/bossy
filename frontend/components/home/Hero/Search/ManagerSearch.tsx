"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Users, Search, Loader2, X, ArrowRight, ChevronUp, ChevronDown, UserCircle } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import type { Company } from "@/utils/search-types"
import { BossNotFoundForm, type PendingBossData } from "./BossNotFound"
import { useUser, useClerk } from "@clerk/nextjs"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useGetBossesQuery } from "@/app/state/api"

// Manager data type from API
interface Manager {
  id: string
  name: string
  position: string
  department?: string
  avatar?: string
}

interface ManagerSearchStepProps {
  selectedCompany: Company
  searchQuery: string
  setSearchQuery: (query: string) => void
  loading: boolean
  onSelectManager?: (manager: Manager) => void
  onAddNewBoss?: (bossData: PendingBossData) => Promise<void>
}

export function ManagerSearchStep({
  selectedCompany,
  searchQuery,
  setSearchQuery,
  loading: externalLoading,
  onSelectManager,
}: ManagerSearchStepProps) {
  const { isSignedIn } = useUser()
  const clerk = useClerk()

  // Fetch bosses for the selected company
  const { data: bosses = [], isLoading: bossesLoading, refetch } = useGetBossesQuery(selectedCompany.mapboxId)

  const [filteredManagers, setFilteredManagers] = useState<Manager[]>([])
  const [open, setOpen] = useState(false)
  const [dropdownForceOpen, setDropdownForceOpen] = useState(false)
  const [showBossNotFoundForm, setShowBossNotFoundForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingBossForm, setPendingBossForm] = useState(false)

  console.log(bosses)
  // Combined loading state
  const loading = externalLoading || bossesLoading

  // Refetch bosses when company changes
  useEffect(() => {
    if (selectedCompany?.mapboxId) {
      refetch()
      // Auto-open dropdown when company is selected and bosses are loaded
      if (bosses.length > 0 && !open) {
        setOpen(true)
      }
    }
  }, [selectedCompany?.mapboxId, refetch])    

  // Update filtered managers when bosses change or search query changes
  // useEffect(() => {
  //   if (searchQuery.trim() === "") {
  //     // Show all bosses when no search query
  //     setFilteredManagers(bosses)
  //     return
  //   }

  //   const filtered = bosses.filter(
  //     (manager) =>
  //       manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       manager.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       (manager.department && manager.department.toLowerCase().includes(searchQuery.toLowerCase())),
  //   )

  //   setFilteredManagers(filtered)
  // }, [searchQuery, bosses])

  // Check if we need to open the boss form after authentication
  useEffect(() => {
    if (isSignedIn && pendingBossForm) {
      setShowBossNotFoundForm(true)
      setPendingBossForm(false)
    }
  }, [isSignedIn, pendingBossForm])

  const toggleDropdown = () => {
    // Always allow toggling
    setDropdownForceOpen(!dropdownForceOpen)
    setOpen(!open)
  }

  const handleSelectManager = (manager: Manager) => {
    if (onSelectManager) {
      onSelectManager(manager)
    }
    setOpen(false)
    setDropdownForceOpen(false)
  }

  const handleBossNotFound = () => {
    if (!isSignedIn) {
      setPendingBossForm(true)

      // Open Clerk's sign-in modal
      clerk.openSignIn({
        redirectUrl: window.location.href,
        afterSignInUrl: window.location.href,
      })
      return
    }

    setOpen(false)
    setDropdownForceOpen(false)
    setShowBossNotFoundForm(true)
  }

  const handleCloseBossForm = () => {
    setShowBossNotFoundForm(false)
  }

  const handleInputFocus = () => {
    // Show all bosses when input is focused
    setFilteredManagers(bosses)
    setOpen(true)
  }

  const handleSubmitSuccess = () => {
    toast.success("Boss request sent! Please check your email for updates.")
    // Refetch bosses after successful submission
    refetch()
  }

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Users className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="search"
          className="block w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-7 pl-12 pr-32 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          placeholder={`Search for a manager at ${selectedCompany.name}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Search className="h-5 w-5 text-muted-foreground" />
              <button
                onClick={toggleDropdown}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label={open ? "Close dropdown" : "Open dropdown"}
              >
                {open || dropdownForceOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Manager dropdown */}
        {(open || dropdownForceOpen) && (
          <div
            className="absolute z-50 mt-1 w-full max-w-md rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
            style={{ top: "100%", left: "0", zIndex: 9999 }}
          >
            <div className="top-0 z-10 flex justify-between items-center p-2 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-500">
                {filteredManagers.length} {filteredManagers.length === 1 ? "manager" : "managers"} found
              </span>
              <button
                onClick={() => {
                  setOpen(false)
                  setDropdownForceOpen(false)
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Close dropdown"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="max-h-[calc(60vh-40px)] overflow-y-auto">
              {loading ? (
                <div className="p-6 flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {filteredManagers.length > 0 ? (
                    <div className="border-b border-gray-100 dark:border-gray-700">
                      {filteredManagers.map((manager) => (
                        <div
                          key={manager.id}
                          className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                          onClick={() => handleSelectManager(manager)}
                        >
                          <UserCircle className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <div className="font-medium">{manager.name}</div>
                            <div className="text-xs text-gray-500">{manager.position}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.trim().length > 0 ? (
                    <div className="p-3 text-sm text-gray-500 border-b border-gray-100 dark:border-gray-700">
                      <p className="mb-2">No managers found</p>
                    </div>
                  ) : bosses.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 border-b border-gray-100 dark:border-gray-700">
                      <p className="mb-2">No managers found for this company</p>
                    </div>
                  ) : null}

                  {/* Boss not here option - always visible */}
                  <div
                    className="p-3 text-center text-primary hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={handleBossNotFound}
                  >
                    <span className="font-medium">Boss not here?</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Boss Not Found Form */}
      <AnimatePresence>
        {showBossNotFoundForm && (
          <BossNotFoundForm
            company={selectedCompany}
            onClose={handleCloseBossForm}
            isSubmitting={isSubmitting}
            onSubmitSuccess={handleSubmitSuccess}
          />
        )}
      </AnimatePresence>
    </>
  )
}
