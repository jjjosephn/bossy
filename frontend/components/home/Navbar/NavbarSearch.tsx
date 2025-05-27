"use client"
import Link from "next/link"
import { User, Search, X, ArrowRight } from "lucide-react"
import { useGetBossesQuery, useGetBossInfoQuery } from "@/app/state/api"
import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { Input } from "../../ui/input"
import { useLocation } from "@/utils/locations-utils"
import type { Company } from "@/utils/search-types"
import { CompanySearchStep } from "@/components/home/Hero/Search/CompanySearch"
import { CustomSearchStep } from "../Hero/Search/CustomSearch"

const NavbarSearch = () => {
  const pathname = usePathname()
  const isBossPage = /^\/boss\/[^/]+$/.test(pathname)
  const bossId = isBossPage ? pathname.split("/")[2] : null
  const { data: bossInfo } = useGetBossInfoQuery(bossId ?? "", { skip: !bossId })
  const { data: bosses } = useGetBossesQuery(bossInfo?.Company.mapboxId ?? "", { skip: !bossInfo?.Company.mapboxId })
  const [companySearch, setCompanySearch] = useState(false)
  const [customSearch, setCustomSearch] = useState(false) // Add state for custom search mode
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [companyNameInput, setCompanyNameInput] = useState("")
  const [addressInput, setAddressInput] = useState("")
  const [customLocation, setCustomLocation] = useState<string | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const { userLocation, locationLoading } = useLocation()
  const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  const filteredBosses =
    bosses?.filter((boss) => {
      const fullName = `${boss.bossFirstName} ${boss.bossLastName}`.toLowerCase()
      return (
        fullName.includes(searchQuery.toLowerCase()) || boss.position?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }) || []

  const handleCustomSearch = async (companyName: string, locationString: string) => {
    setCustomLocation(locationString)

    try {
      const encodedSearch = encodeURIComponent(companyName)
      const sessionToken = `${Math.random().toString(36).substring(2)}-${Date.now()}`
      const searchResponse = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedSearch}&language=en&types=poi&limit=10&proximity=${locationString}&session_token=${sessionToken}&access_token=${ACCESS_TOKEN}`,
      )

      if (!searchResponse.ok) {
        throw new Error("Network response was not ok")
      }

      const searchData = await searchResponse.json()
      setCompanyNameInput(companyName)
      setCompanySearch(false)
      setCustomSearch(false) // Exit custom search mode
    } catch (error) {
      alert(
        "We couldn't find any companies matching your search. Please try again with a different address or company name.",
      )
    }
  }

  // Add handlers for CompanySearchStep
  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company)
    setCompanyNameInput(company.name)
    setCompanySearch(false)
    setCustomSearch(false) // Exit custom search mode
  }

  const handleCantFindCompany = () => {
    // Switch to custom search mode when user can't find a company
    setCustomSearch(true)
  }

  // Handler to go back from custom search to company search
  const handleBackToCompany = () => {
    setCustomSearch(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (!popoverRef.current?.contains(target) && target !== inputRef.current) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a boss"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              ref={inputRef}
              className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-6 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />

            {open && (
              <div
                ref={popoverRef}
                className="absolute left-0 right-0 mt-1 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto z-50"
              >
                <div className="top-0 z-10 flex justify-between items-center p-2 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500">
                    {filteredBosses.length} {filteredBosses.length === 1 ? "result" : "results"} found
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    aria-label="Close dropdown"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {filteredBosses.length > 0 ? (
                  <>
                    {filteredBosses.map((boss) => (
                      <Link href={`/boss/${boss.bossId}`} key={boss.bossId} onClick={() => setOpen(false)}>
                        <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <User className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <div className="font-medium">
                              {boss.bossFirstName} {boss.bossLastName}
                            </div>
                            <div className="text-xs text-gray-500">{boss.position}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                        </div>
                      </Link>
                    ))}
                  </>
                ) : searchQuery.trim().length > 0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    <p>No bosses found</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">at</span>
            {companySearch ? (
              <div className="relative">
                {customSearch ? (
                  <div className="relative">
                     <CustomSearchStep
                        companyNameInput={companyNameInput}
                        setCompanyNameInput={setCompanyNameInput}
                        addressInput={addressInput}
                        setAddressInput={setAddressInput}
                        onBackToCompany={handleBackToCompany}
                        onCustomSearch={handleCustomSearch}
                        userLocation={userLocation}
                     />
                     <button
                        onClick={() => {
                           setCompanySearch(false)
                           setCustomSearch(false)
                        }}
                        className="absolute right-3 top-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-200 z-10"
                        aria-label="Close company search"
                     >
                        <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                     </button>
                  </div>
                ) : (
                  <div className="relative">
                    <CompanySearchStep
                      searchQuery={companyNameInput}
                      setSearchQuery={setCompanyNameInput}
                      onSelectCompany={handleSelectCompany}
                      onCantFindCompany={handleCantFindCompany}
                      userLocation={userLocation}
                      customLocation={customLocation}
                      locationLoading={locationLoading}
                    />
                    <button
                      onClick={() => setCompanySearch(false)}
                      className="absolute right-3 top-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-200 z-10"
                      aria-label="Close company search"
                    >
                      <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setCompanySearch(true)}
                className="text-sm font-medium text-primary hover:scale-105 underline underline-offset-2 transition-colors duration-200"
              >
                {selectedCompany?.name || bossInfo?.Company?.companyName || "Search company"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavbarSearch
