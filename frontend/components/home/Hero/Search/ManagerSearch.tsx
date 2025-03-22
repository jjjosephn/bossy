"use client"

import { Input } from "@/components/ui/input"
import { Users, Search, Loader2 } from "lucide-react"
import type { Company } from "@/utils/search-types"

interface ManagerSearchStepProps {
  selectedCompany: Company
  searchQuery: string
  setSearchQuery: (query: string) => void
  loading: boolean
}

export function ManagerSearchStep({ selectedCompany, searchQuery, setSearchQuery, loading }: ManagerSearchStepProps) {
  return (
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
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <Search className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
    </div>
  )
}

