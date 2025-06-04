"use client"
import Link from "next/link"
import { User, ArrowRight } from "lucide-react"
import { useGetBossesQuery, useGetBossInfoQuery } from "@/app/state/api"
import { useEffect, useState, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Input } from "../../ui/input"
import { useLocation } from "@/utils/locations-utils"
import type { Company } from "@/utils/search-types"
import { NavbarCompanySearchStep } from "./NavbarCompanySearch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const NavbarSearch = () => {
  const router = useRouter()
  const pathname = usePathname()
  const isBossPage = /^\/boss\/[^/]+$/.test(pathname)
  const bossId = isBossPage ? pathname.split("/")[2] : null
  const { data: bossInfo } = useGetBossInfoQuery(bossId ?? "", { skip: !bossId })
  const [companySearch, setCompanySearch] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [companyNameInput, setCompanyNameInput] = useState("")
  const [searchType, setSearchType] = useState("boss")
  const [customLocation] = useState<string | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const { data: bosses } = useGetBossesQuery(selectedCompany?.mapboxId ?? bossInfo?.Company.mapboxId ?? "", {
    skip: !selectedCompany?.mapboxId && !bossInfo?.Company.mapboxId,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const { userLocation, locationLoading } = useLocation()

  const filteredBosses =
    bosses?.filter((boss) => {
      const fullName = `${boss.bossFirstName} ${boss.bossLastName}`.toLowerCase()
      return (
        fullName.includes(searchQuery.toLowerCase()) || boss.position?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }) || []

  const handleSelectCompany = async (company: Company) => {
    setSelectedCompany(company)
    setCompanyNameInput(company.name)
    setCompanySearch(false)

    if (searchType === "company") {
      router.push(`/company/${company.mapboxId}`)
      setOpen(false)
    }
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
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-2 w-full">
          <div className="pr-[10px]">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-32 h-9 border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full text-center rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
                <SelectItem value="boss" className="rounded-lg text-center hover:bg-primary/10 transition-colors duration-200">
                  Boss
                </SelectItem>
                <SelectItem value="company" className="w-full text-center rounded-lg hover:bg-primary/10 transition-colors duration-200">
                  Company
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {searchType === "boss" ? (
            <>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
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
                    </div>

                    {filteredBosses.length >= 0 && (
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
                        <Link href="/">
                          <div className="p-3 text-center text-primary hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-t border-gray-100 dark:border-gray-700">
                            <span className="font-medium">Can&apos;t find your boss?</span>
                          </div>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">at</span>
                {companySearch ? (
                  <div className="relative w-64 flex-shrink-0">
                    <NavbarCompanySearchStep
                      searchQuery={companyNameInput}
                      setSearchQuery={setCompanyNameInput}
                      onSelectCompany={handleSelectCompany}
                      onClose={() => setCompanySearch(false)}
                      userLocation={userLocation}
                      customLocation={customLocation}
                      locationLoading={locationLoading}
                    />
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
            </>
          ) : (
            <div className="relative flex-1">
              <NavbarCompanySearchStep
                searchQuery={companyNameInput}
                setSearchQuery={setCompanyNameInput}
                onSelectCompany={handleSelectCompany}
                onClose={() => setCompanySearch(false)}
                userLocation={userLocation}
                customLocation={customLocation}
                locationLoading={locationLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavbarSearch
