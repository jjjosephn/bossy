"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CompanySearchStep } from "./Search/CompanySearch"
import { CustomSearchStep } from "./Search/CustomSearch"
import { ManagerSearchStep } from "./Search/ManagerSearch"
import { useLocation } from "@/utils/locations-utils"
import type { Company, SearchStep } from "@/utils/search-types"

const SearchComponent = () => {
  const [searchStep, setSearchStep] = useState<SearchStep>("company")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [companyNameInput, setCompanyNameInput] = useState("")
  const [addressInput, setAddressInput] = useState("")
  const [customLocation, setCustomLocation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchComponentRef = useRef<HTMLDivElement>(null)
  const { userLocation, locationLoading } = useLocation()
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  const handleBackToCompany = () => {
    setSearchStep("company")
    setSelectedCompany(null)
    setSearchQuery("")
    setCompanyNameInput("")
    setAddressInput("")
    setCustomLocation(null)
  }

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company)
    setSearchQuery("")
    setSearchStep("manager")
  }

  const handleCantFindCompany = () => {
    setSearchStep("custom-search")
    setCompanyNameInput(searchQuery)
    setSearchQuery("")
  }

  const handleCustomSearch = async (companyName: string, locationString: string) => {
    setCustomLocation(locationString)

    try {
      // Search for companies near this address
      const encodedSearch = encodeURIComponent(companyName)
      const sessionToken = `${Math.random().toString(36).substring(2)}-${Date.now()}`
      const searchResponse = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedSearch}&language=en&types=poi&limit=10&proximity=${locationString}&session_token=${sessionToken}&access_token=${ACCESS_TOKEN}`,
      )

      if (!searchResponse.ok) {
        throw new Error("Network response was not ok")
      }

      const searchData = await searchResponse.json()

      // Update the results and go back to company search step
      setSearchQuery(companyName)
      setSearchStep("company")
    } catch (error) {
      alert(
        "We couldn't find any companies matching your search. Please try again with a different address or company name.",
      )
    }
  }

  // Handle clicks outside the component to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchComponentRef.current && !searchComponentRef.current.contains(event.target as Node)) {
        const customEvent = new CustomEvent("closeDropdowns")
        document.dispatchEvent(customEvent)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div
      className="relative max-w-md w-full mt-2 transition-all duration-300 hover:scale-[1.01] focus-within:scale-[1.01]"
      ref={searchComponentRef}
    >
      <div className="mb-2 flex items-center">
        {searchStep === "custom-search" && (
          <Button variant="ghost" size="sm" className="mr-2 p-1" onClick={handleBackToCompany}>
            ← Back
          </Button>
        )}
        {searchStep === "manager" && selectedCompany && (
          <Button variant="ghost" size="sm" className="mr-2 p-1" onClick={handleBackToCompany}>
            ← Back
          </Button>
        )}
        <span className="text-sm font-medium">
          {searchStep === "company"
            ? "Step 1: Find your company"
            : searchStep === "custom-search"
              ? "Can't find your company?"
              : "Step 2: Find your boss"}
        </span>
        {searchStep === "manager" && selectedCompany && (
          <span className="ml-2 text-sm text-primary font-medium">at {selectedCompany.name}</span>
        )}
      </div>

      {searchStep === "company" && (
        <CompanySearchStep
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectCompany={handleSelectCompany}
          onCantFindCompany={handleCantFindCompany}
          userLocation={userLocation}
          customLocation={customLocation}
          locationLoading={locationLoading}
        />
      )}

      {searchStep === "custom-search" && (
        <CustomSearchStep
          companyNameInput={companyNameInput}
          setCompanyNameInput={setCompanyNameInput}
          addressInput={addressInput}
          setAddressInput={setAddressInput}
          onBackToCompany={handleBackToCompany}
          onCustomSearch={handleCustomSearch}
          userLocation={userLocation}
        />
      )}

      {searchStep === "manager" && selectedCompany && (
        <ManagerSearchStep
          selectedCompany={selectedCompany}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loading={loading}
        />
      )}
    </div>
  )
}

export default SearchComponent

