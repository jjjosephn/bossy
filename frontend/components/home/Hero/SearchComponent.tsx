"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CompanySearchStep } from "./Search/CompanySearch"
import { CustomSearchStep } from "./Search/CustomSearch"
import { ManagerSearchStep } from "./Search/ManagerSearch"
import { useLocation } from "@/utils/locations-utils"
import type { Company, SearchStep } from "@/utils/search-types"
import { useLazyGetSearchComponentMapboxDataQuery } from "@/app/state/api"

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
  const [encodedSearch, setEncodedSearch] = useState<string>("")
  const [triggerGetMapboxData, { data, isLoading, isError }] = useLazyGetSearchComponentMapboxDataQuery()

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
      const result = await triggerGetMapboxData({
        encodedSearch: encodeURIComponent(companyName),
        locationString,
      }).unwrap();

      console.log("Mapbox data:", result);
      setSearchQuery(companyName);
      setSearchStep("company");
    } catch (error) {
      console.error("Mapbox fetch error:", error);
      alert("We couldn't find any companies matching your search. Please try again.");
    }
  }

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

