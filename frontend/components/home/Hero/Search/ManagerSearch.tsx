"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Users, Search, Loader2, X, ArrowRight, ChevronUp, ChevronDown, UserCircle } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import type { Company } from "@/utils/search-types"
import { BossNotFoundForm, type BossData } from "./BossNotFound"
import { useUser, useClerk } from "@clerk/nextjs"

// Mock manager data type
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
  onAddNewBoss?: (bossData: BossData) => Promise<void>
}

// Generate mock managers based on company name for demo purposes
const generateMockManagers = (companyName: string): Manager[] => {
  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Product"]
  const positions = ["Manager", "Director", "VP", "Team Lead", "Head of", "Senior Manager"]

  return Array.from({ length: 8 }, (_, i) => {
    const department = departments[Math.floor(Math.random() * departments.length)]
    const position = positions[Math.floor(Math.random() * positions.length)]

    return {
      id: `mgr-${i + 1}`,
      name: `Manager ${i + 1}`,
      position: `${position}${department ? ` of ${department}` : ""}`,
      department: department,
    }
  })
}

export function ManagerSearchStep({
  selectedCompany,
  searchQuery,
  setSearchQuery,
  loading,
  onSelectManager,
  onAddNewBoss,
}: ManagerSearchStepProps) {
  const { isSignedIn } = useUser()
  const clerk = useClerk()
  const [managers, setManagers] = useState<Manager[]>([])
  const [filteredManagers, setFilteredManagers] = useState<Manager[]>([])
  const [open, setOpen] = useState(false)
  const [dropdownForceOpen, setDropdownForceOpen] = useState(false)
  const [showBossNotFoundForm, setShowBossNotFoundForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingBossForm, setPendingBossForm] = useState(false)

  // Generate mock managers when the component mounts or company changes
  useEffect(() => {
    const mockManagers = generateMockManagers(selectedCompany.name)
    setManagers(mockManagers)
  }, [selectedCompany.name])

  // Filter managers based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Show all managers when no search query
      setFilteredManagers(managers)
      return
    }

    const filtered = managers.filter(
      (manager) =>
        manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manager.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (manager.department && manager.department.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    setFilteredManagers(filtered)
  }, [searchQuery, managers])

  // Check if we need to open the boss form after authentication
  useEffect(() => {
    if (isSignedIn && pendingBossForm) {
      setShowBossNotFoundForm(true)
      setPendingBossForm(false)
    }
  }, [isSignedIn, pendingBossForm])

  const toggleDropdown = () => {
    if (filteredManagers.length > 0) {
      setDropdownForceOpen(!dropdownForceOpen)
      setOpen(!open)
    }
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
      // Set pending state to open form after auth
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

  const handleSubmitBossForm = async (bossData: BossData) => {
    if (onAddNewBoss) {
      setIsSubmitting(true)
      try {
        await onAddNewBoss(bossData)
        setShowBossNotFoundForm(false)
      } catch (error) {
        console.error("Error adding new boss:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleInputFocus = () => {
    setFilteredManagers(managers)
    setOpen(true)
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
              {filteredManagers.length > 0 && (
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
              )}
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

            {filteredManagers.length > 0 ? (
              <>
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

                {/* Boss not here option */}
                <div
                  className="p-3 text-center text-primary hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-t border-gray-100 dark:border-gray-700"
                  onClick={handleBossNotFound}
                >
                  <span className="font-medium">Boss not here?</span>
                </div>
              </>
            ) : searchQuery.trim().length > 0 && !loading ? (
              <div className="p-3 text-sm text-gray-500">
                <p className="mb-2">No managers found</p>
                <button className="text-primary font-medium" onClick={handleBossNotFound}>
                  Boss not here?
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Boss Not Found Form */}
      <AnimatePresence>
        {showBossNotFoundForm && (
          <BossNotFoundForm
            company={selectedCompany}
            onClose={handleCloseBossForm}
            onSubmit={handleSubmitBossForm}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>
    </>
  )
}

