"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowRight,
  Building,
  ChevronDown,
  ChevronUp,
  Hotel,
  Loader2,
  MapPin,
  Search,
  Users,
  Utensils,
  X,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface MapboxSuggestion {
  name: string
  name_preferred?: string
  mapbox_id: string
  feature_type: string
  address?: string
  full_address?: string
  place_formatted?: string
  maki?: string
  poi_category?: string[]
  distance?: number
  context?: {
    country?: {
      name: string
      country_code: string
    }
    region?: {
      name: string
      region_code: string
    }
    place?: {
      name: string
    }
  }
}

interface MapboxResponse {
  suggestions: MapboxSuggestion[]
  attribution: string
  response_id: string
}

interface MapboxRetrieveResponse {
  features: Array<{
    id: string
    type: string
    place_type: string[]
    properties: {
      name: string
      mapbox_id: string
      feature_type: string
      address?: string
      coordinates?: {
        latitude: number
        longitude: number
      }
    }
    geometry: {
      type: string
      coordinates: [number, number]
    }
    center: [number, number]
  }>
}

interface Company {
  id: string
  name: string
  industry?: string
}

const SearchComponent = () => {
  const [searchStep, setSearchStep] = useState("company") // "company", "custom-search", or "manager"
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [companyNameInput, setCompanyNameInput] = useState("")
  const [addressInput, setAddressInput] = useState("")
  const [results, setResults] = useState<MapboxSuggestion[]>([])
  const [addressResults, setAddressResults] = useState<MapboxSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)
  const [customSearchLoading, setCustomSearchLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [addressOpen, setAddressOpen] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const addressDebounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const [userLocation, setUserLocation] = useState<string | null>(null)
  const [customLocation, setCustomLocation] = useState<string | null>(null)
  const [locationLoading, setLocationLoading] = useState(true)
  const [selectedAddress, setSelectedAddress] = useState<MapboxSuggestion | null>(null)
  const [showCantFindOption, setShowCantFindOption] = useState(false)
  const searchComponentRef = useRef<HTMLDivElement>(null)
  const [dropdownForceOpen, setDropdownForceOpen] = useState(false)

  const sessionToken = useRef(`${Math.random().toString(36).substring(2)}-${Date.now()}`)
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  const handleBackToCompany = () => {
    setSearchStep("company")
    setSelectedCompany(null)
    setSelectedAddress(null)
    setSearchQuery("")
    setCompanyNameInput("")
    setAddressInput("")
    setCustomLocation(null)
  }

  const handleSelectCompany = (suggestion: MapboxSuggestion) => {
    const company: Company = {
      id: suggestion.mapbox_id,
      name: suggestion.name_preferred || suggestion.name,
      industry: suggestion.poi_category
        ? suggestion.poi_category[0]
        : suggestion.feature_type === "address"
          ? "Address"
          : "Place",
    }

    setSelectedCompany(company)
    setSearchQuery("")
    setSearchStep("manager")
    setOpen(false)
    setDropdownForceOpen(false)
  }

  const handleCantFindCompany = () => {
    setSearchStep("custom-search")
    setCompanyNameInput(searchQuery)
    setSearchQuery("")
    setOpen(false)
    setDropdownForceOpen(false)
  }

  const handleSelectAddress = (suggestion: MapboxSuggestion) => {
    setSelectedAddress(suggestion)
    setAddressOpen(false)
  }

  const toggleDropdown = () => {
    if (searchStep === "company" && results.length > 0) {
      setDropdownForceOpen(!dropdownForceOpen)
      setOpen(!open)
    }
  }

  const handleCustomSearch = async () => {
    if (!companyNameInput.trim() || !selectedAddress) return

    setCustomSearchLoading(true)

    try {
      // Get coordinates for the selected address
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${selectedAddress.mapbox_id}?session_token=${sessionToken.current}&access_token=${ACCESS_TOKEN}`,
      )

      if (!response.ok) {
        throw new Error("Failed to retrieve location details")
      }

      const data: MapboxRetrieveResponse = await response.json()

      // Check if we have valid data
      if (!data.features || data.features.length === 0) {
        throw new Error("Invalid location data received")
      }

      const feature = data.features[0]

      // Set the custom location based on the selected address coordinates
      // The coordinates are in properties.coordinates instead of center
      if (feature.properties?.coordinates) {
        const { longitude, latitude } = feature.properties.coordinates
        const locationString = `${longitude},${latitude}`
        setCustomLocation(locationString)

        // Search for companies near this address
        const encodedSearch = encodeURIComponent(companyNameInput)
        const searchResponse = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedSearch}&language=en&types=poi&limit=10&proximity=${locationString}&session_token=${sessionToken.current}&access_token=${ACCESS_TOKEN}`,
        )

        if (!searchResponse.ok) {
          throw new Error("Network response was not ok")
        }

        const searchData: MapboxResponse = await searchResponse.json()

        // Update the results and go back to company search step
        setResults(searchData.suggestions)
        setSearchQuery(companyNameInput)
        setSearchStep("company")

        // Only show the dropdown if we have results
        if (searchData.suggestions.length > 0) {
          setOpen(true)
          setDropdownForceOpen(true)
        }
      } else {
        throw new Error("Could not find coordinates for this address")
      }
    } catch (error) {
      // Fallback to using user's current location if we can't get the address coordinates
      if (userLocation && companyNameInput.trim()) {
        try {
          const encodedSearch = encodeURIComponent(companyNameInput)
          const searchResponse = await fetch(
            `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedSearch}&language=en&types=poi&limit=10&proximity=${userLocation}&session_token=${sessionToken.current}&access_token=${ACCESS_TOKEN}`,
          )

          if (!searchResponse.ok) {
            throw new Error("Network response was not ok")
          }

          const searchData: MapboxResponse = await searchResponse.json()

          // Update the results and go back to company search step
          setResults(searchData.suggestions)
          setSearchQuery(companyNameInput)
          setSearchStep("company")

          // Only show the dropdown if we have results
          if (searchData.suggestions.length > 0) {
            setOpen(true)
            setDropdownForceOpen(true)
          }
        } catch (fallbackError) {
          alert(
            "We couldn't find any companies matching your search. Please try again with a different address or company name.",
          )
        }
      } else {
        alert(
          "We couldn't find any companies matching your search. Please try again with a different address or company name.",
        )
      }
    } finally {
      setCustomSearchLoading(false)
    }
  }

  // Handle clicks outside the component to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchComponentRef.current && !searchComponentRef.current.contains(event.target as Node)) {
        setOpen(false)
        setAddressOpen(false)
        setDropdownForceOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const proximity = `${position.coords.longitude},${position.coords.latitude}`
          setUserLocation(proximity)
          setLocationLoading(false)
        },
        () => {
          // Silently fall back to New York City coordinates without error logging
          setUserLocation("-73.990593,40.740121")
          setLocationLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      )
    } else {
      // Geolocation not available, use default
      setUserLocation("-73.990593,40.740121")
      setLocationLoading(false)
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length === 0 || searchStep !== "company") {
      setResults([])
      setShowCantFindOption(false)
      return
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(async () => {
      if (locationLoading) return

      setLoading(true)
      try {
        const encodedSearch = encodeURIComponent(searchQuery)
        const response = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedSearch}&language=en&types=poi,address&limit=10${customLocation || userLocation ? `&proximity=${customLocation || userLocation}` : ""}&session_token=${sessionToken.current}&access_token=${ACCESS_TOKEN}`,
        )

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const data: MapboxResponse = await response.json()
        setResults(data.suggestions)
        setShowCantFindOption(true)
        setOpen(true)
      } catch (error) {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [searchQuery, locationLoading, userLocation, customLocation, searchStep])

  useEffect(() => {
    if (addressInput.trim().length === 0 || searchStep !== "custom-search") {
      setAddressResults([])
      return
    }

    if (addressDebounceTimeout.current) {
      clearTimeout(addressDebounceTimeout.current)
    }

    addressDebounceTimeout.current = setTimeout(async () => {
      if (locationLoading) return

      setAddressLoading(true)
      try {
        const encodedSearch = encodeURIComponent(addressInput)
        const response = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedSearch}&language=en&types=address&limit=5${userLocation ? `&proximity=${userLocation}` : ""}&session_token=${sessionToken.current}&access_token=${ACCESS_TOKEN}`,
        )

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const data: MapboxResponse = await response.json()
        setAddressResults(data.suggestions)
        setAddressOpen(true)
      } catch (error) {
        setAddressResults([])
      } finally {
        setAddressLoading(false)
      }
    }, 300)

    return () => {
      if (addressDebounceTimeout.current) {
        clearTimeout(addressDebounceTimeout.current)
      }
    }
  }, [addressInput, locationLoading, userLocation, searchStep])

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
        </div>
      )}

      {searchStep === "custom-search" && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="space-y-2">
            <label htmlFor="company-name" className="text-sm font-medium">
              Company Name
            </label>
            <Input
              id="company-name"
              value={companyNameInput}
              onChange={(e) => setCompanyNameInput(e.target.value)}
              placeholder="Enter company name"
              className="py-5"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company-address" className="text-sm font-medium">
              Company Address
            </label>
            <div className="relative">
              <Input
                id="company-address"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Enter address or location"
                className="py-5 pr-10"
                onFocus={() => addressResults.length > 0 && setAddressOpen(true)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {addressLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {selectedAddress && (
              <div className="px-3 py-2 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800 flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                  <span className="text-sm text-green-800 dark:text-green-200 truncate">{selectedAddress.name}</span>
                </div>
                <button
                  onClick={() => setSelectedAddress(null)}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handleCustomSearch}
            disabled={customSearchLoading || !companyNameInput.trim() || !selectedAddress}
          >
            {customSearchLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>Search</>
            )}
          </Button>
        </div>
      )}

      {searchStep === "manager" && (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            className="block w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-7 pl-12 pr-32 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            placeholder="Search for a manager"
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
      )}

      {(open || dropdownForceOpen) && searchStep === "company" && (
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
                  onClick={handleCantFindCompany}
                >
                  <span className="font-medium">Can't find your company?</span>
                </div>
              )}
            </>
          ) : searchQuery.trim().length > 0 && !loading ? (
            <div className="p-3 text-sm text-gray-500">
              <p className="mb-2">No companies found</p>
              <Button variant="outline" size="sm" className="w-full" onClick={handleCantFindCompany}>
                Search by address instead
              </Button>
            </div>
          ) : null}
        </div>
      )}

      {addressOpen && searchStep === "custom-search" && (
        <div
          className="absolute z-50 mt-1 w-full max-w-md rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
          style={{ top: "calc(100% - 60px)", left: "0", zIndex: 9999 }}
        >
          <div className="sticky top-0 z-10 flex justify-between items-center p-2 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs text-gray-500">
              {addressResults.length} {addressResults.length === 1 ? "address" : "addresses"} found
            </span>
            <button
              onClick={() => setAddressOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Close dropdown"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {addressResults.length > 0 ? (
            addressResults.map((suggestion) => (
              <div
                key={suggestion.mapbox_id}
                className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                onClick={() => handleSelectAddress(suggestion)}
              >
                <MapPin className="h-5 w-5 text-gray-500 mr-3" />
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
            ))
          ) : addressInput.trim().length > 0 && !addressLoading ? (
            <div className="p-3 text-sm text-gray-500">No addresses found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchComponent

