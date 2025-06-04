"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Building, Search, ArrowRight, Utensils, Hotel } from "lucide-react"
import type { MapboxSuggestion, Company } from "@/utils/search-types"
import { useMapboxSearch } from "@/utils/mapbox-utils"
import { useCheckCompanyExistsMutation } from "@/app/state/api"
import Link from "next/link"

interface CompanySearchStepProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSelectCompany: (company: Company) => void
  userLocation: string | null
  customLocation: string | null
  onClose: () => void
  locationLoading: boolean
}

export function NavbarCompanySearchStep({
  searchQuery,
  setSearchQuery,
  onSelectCompany,
  userLocation,
  customLocation,
  onClose,
}: CompanySearchStepProps) {
  const [dropdownForceOpen, setDropdownForceOpen] = useState(false)
  const [showCantFindOption, setShowCantFindOption] = useState(false)
  const [checkCompanyExists] = useCheckCompanyExistsMutation()
  const containerRef = useRef<HTMLDivElement>(null)

  const { results, open, setOpen } = useMapboxSearch({
    query: searchQuery,
    proximity: userLocation,
    customLocation,
    enabled: true,
  })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setDropdownForceOpen(false)
        onClose()
      }
    }

    if (open || dropdownForceOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, dropdownForceOpen, setOpen, onClose])

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

  useEffect(() => {
    if (results.length > 0 && searchQuery.trim().length > 0) {
      setShowCantFindOption(true)
    } else {
      setShowCantFindOption(false)
    }
  }, [results.length, searchQuery])

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Building className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="search"
        className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-6 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
        placeholder="Search for a company"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
      />

      {(open || dropdownForceOpen) && (
        <div
          className="absolute z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
          style={{ top: "100%", left: "0", zIndex: 9999 }}
        >
          <div className="top-0 z-10 flex justify-between items-center p-2 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs text-gray-500">
              {results.length} {results.length === 1 ? "result" : "results"} found
            </span>
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
                <Link href="/">
                  <div className="p-3 text-center text-primary hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-t border-gray-100 dark:border-gray-700">
                    <span className="font-medium">Can&apos;t find your company?</span>
                  </div>
                </Link>
              )}
            </>
          ) : searchQuery.trim().length > 0 ? (
            <Link href="/">
              <div className="p-3 text-center text-primary hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-t border-gray-100 dark:border-gray-700">
                <span className="font-medium">Can&apos;t find your company?</span>
              </div>
            </Link>
          ) : null}
        </div>
      )}
    </div>
  )
}
