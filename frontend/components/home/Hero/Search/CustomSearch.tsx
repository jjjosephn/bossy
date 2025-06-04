"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2, X, ArrowRight } from "lucide-react"
import type { MapboxSuggestion, MapboxRetrieveResponse } from "@/utils/search-types"
import { useMapboxSearch } from "@/utils/mapbox-utils"
import { useLazyGetCustomSearchMapboxDataQuery } from "@/app/state/api"


interface CustomSearchStepProps {
  companyNameInput: string
  setCompanyNameInput: (name: string) => void
  addressInput: string
  setAddressInput: (address: string) => void
  onBackToCompany: () => void
  onCustomSearch: (companyName: string, location: string) => Promise<void>
  userLocation: string | null
}

export function CustomSearchStep({
  companyNameInput,
  setCompanyNameInput,
  addressInput,
  setAddressInput,
  onCustomSearch,
  userLocation,
}: CustomSearchStepProps) {
  const [selectedAddress, setSelectedAddress] = useState<MapboxSuggestion | null>(null)
  const [customSearchLoading, setCustomSearchLoading] = useState(false)
  const [triggerGetMapboxData] = useLazyGetCustomSearchMapboxDataQuery()
  
  const {
    results: addressResults,
    loading: addressLoading,
    open: addressOpen,
    setOpen: setAddressOpen,
  } = useMapboxSearch({
    query: addressInput,
    proximity: userLocation,
    customLocation: null,
    searchType: "address",
    enabled: true,
    limit: 10,
  })

  const handleSelectAddress = (suggestion: MapboxSuggestion) => {
    setSelectedAddress(suggestion)
    setAddressOpen(false)
  }

  const handleSearch = async () => {
    if (!companyNameInput.trim() || !selectedAddress) return

    setCustomSearchLoading(true)

    try {
      const data: MapboxRetrieveResponse = await triggerGetMapboxData({
        selectedAddressMapboxId: selectedAddress.mapbox_id
      }).unwrap()

      if (!data.features || data.features.length === 0) {
        throw new Error("Invalid location data received")
      }

      console.log("Mapbox data:", data)
      const feature = data.features[0]

      if (feature.properties?.coordinates) {
        const { longitude, latitude } = feature.properties.coordinates
        const locationString = `${longitude},${latitude}`

        await onCustomSearch(companyNameInput, locationString)
      } else {
        throw new Error("Could not find coordinates for this address")
      }
    } catch (error) {
      console.error("Custom search error:", error)
      alert("We couldn't find any companies matching your search. Please try again with a different address or company name.")
    } finally {
      setCustomSearchLoading(false)
    }
  }


  return (
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
        onClick={handleSearch}
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

      {addressOpen && (
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

