"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Building, Search, Loader2, ChevronUp, ChevronDown, X, ArrowRight, Utensils, Hotel } from "lucide-react"
import type { MapboxSuggestion, Company } from "@/utils/search-types"
import { useMapboxSearch } from "@/utils/mapbox-utils"
import { useCheckCompanyExistsMutation } from "@/app/state/api"

interface CompanySearchStepProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSelectCompany: (company: Company) => void
  onCantFindCompany: () => void
  userLocation: string | null
  customLocation: string | null
  locationLoading: boolean
}

export function CompanySearchStep({
  searchQuery,
  setSearchQuery,
  onSelectCompany,
  onCantFindCompany,
  userLocation,
  customLocation,
  locationLoading,
}: CompanySearchStepProps) {
  const [dropdownForceOpen, setDropdownForceOpen] = useState(false)
  const [showCantFindOption, setShowCantFindOption] = useState(false)
  const [checkCompanyExists] = useCheckCompanyExistsMutation()

  const { results, loading, open, setOpen } = useMapboxSearch({
    query: searchQuery,
    proximity: userLocation,
    customLocation,
    enabled: true,
  })

  const toggleDropdown = () => {
    if (results.length > 0) {
      setDropdownForceOpen(!dropdownForceOpen)
      setOpen(!open)
    }
  }

  const handleSelectCompany = (suggestion: MapboxSuggestion) => {
    const company: Company = {
      mapboxId: suggestion.mapbox_id,
      name: suggestion.name_preferred || suggestion.name,
      fullAddress: suggestion.full_address || "",
      industry: suggestion.poi_category
        ? suggestion.poi_category[0]
        : suggestion.feature_type === "address"
          ? "Address"
          : "Place",
    }

    checkCompanyExists({
      mapboxId: company.mapboxId,
      name: company.name,
      fullAddress: company.fullAddress,
    })

    onSelectCompany(company)
    setOpen(false)
    setDropdownForceOpen(false)
  }

  // Show "Can't find option" when we have results and user has typed something
  useEffect(() => {
    if (results.length > 0 && searchQuery.trim().length > 0) {
      setShowCantFindOption(true)
    } else {
      setShowCantFindOption(false)
    }
  }, [results.length, searchQuery])

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Building className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="search"
        className="block w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-7 pl-12 pr-32 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
        placeholder="Search for a company"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <>
            <Search className="h-5 w-5 text-muted-foreground" />
            {results.length > 0 && (
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

      {(open || dropdownForceOpen) && (
        <div
          className="absolute z-50 mt-1 w-full max-w-md rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
          style={{ top: "100%", left: "0", zIndex: 9999 }}
        >
          <div className="top-0 z-10 flex justify-between items-center p-2 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs text-gray-500">
              {results.length} {results.length === 1 ? "result" : "results"} found
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

          {results.length > 0 ? (
            <>
              {results.map((suggestion) => (
                <div
                  key={suggestion.mapbox_id}
                  className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                  onClick={() => handleSelectCompany(suggestion)}
                >
                  {suggestion.feature_type === "address" ? (
                    <Search className="h-5 w-5 text-gray-500 mr-3" />
                  ) : suggestion.poi_category?.includes("restaurant") ? (
                    <Utensils className="h-5 w-5 text-gray-500 mr-3" />
                  ) : suggestion.poi_category?.includes("hotel") ? (
                    <Hotel className="h-5 w-5 text-gray-500 mr-3" />
                  ) : (
                    <Building className="h-5 w-5 text-gray-500 mr-3" />
                  )}
                  <div>
                    <div className="font-medium">{suggestion.name_preferred || suggestion.name}</div>
                    <div className="text-xs text-gray-500">
                      {suggestion.full_address ||
                        suggestion.place_formatted ||
                        (suggestion.context?.place?.name &&
                          `${suggestion.context.place.name}, ${suggestion.context?.region?.name || ""}`)}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              ))}

              {showCantFindOption && (
                <div
                  className="p-3 text-center text-primary hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-t border-gray-100 dark:border-gray-700"
                  onClick={onCantFindCompany}
                >
                  <span className="font-medium">Can't find your company?</span>
                </div>
              )}
            </>
          ) : searchQuery.trim().length > 0 && !loading ? (
            <div className="p-3 text-sm text-gray-500">
              <p className="mb-2">No companies found</p>
              <Button variant="outline" size="sm" className="w-full" onClick={onCantFindCompany}>
                Search by address instead
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

