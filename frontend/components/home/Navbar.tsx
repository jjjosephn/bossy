"use client"
import { Button } from "../ui/button"
import Link from "next/link"
import { LogOut, Star, User, ShieldAlert, Search, X, ArrowRight } from "lucide-react"
import { SignInButton, SignUpButton, useClerk, useUser } from "@clerk/nextjs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  useCheckUserExistsMutation,
  useGetBossesQuery,
  useGetBossInfoQuery,
  useGetPendingBossesQuery,
} from "@/app/state/api"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

const Navbar = () => {
   const { isSignedIn, user } = useUser()
   const { signOut } = useClerk()
   const [checkUser] = useCheckUserExistsMutation()
   const { refetch } = useGetPendingBossesQuery()
   const firstname = user?.firstName
   const lastname = user?.lastName
   const imageUrl = user?.imageUrl
   const pathname = usePathname()
   const isBossPage = /^\/boss\/[^/]+$/.test(pathname)
   const bossId = isBossPage ? pathname.split("/")[2] : null
   const { data: bossInfo } = useGetBossInfoQuery(bossId ?? "", { skip: !bossId })
   const { data: bosses } = useGetBossesQuery(bossInfo?.Company.mapboxId ?? "", { skip: !bossInfo?.Company.mapboxId })

   // Search state
   const [open, setOpen] = useState(false)
   const [searchQuery, setSearchQuery] = useState("")

   const isAdmin = user?.publicMetadata.role === "admin"

   useEffect(() => {
      if (isSignedIn) {
         checkUser({
         userId: user?.id,
         firstName: firstname ?? "",
         lastName: lastname ?? "",
         email: user?.primaryEmailAddress?.emailAddress ?? "",
         })
      }
   }, [isSignedIn, user?.id])

   const filteredBosses =
      bosses?.filter((boss) => {
         const fullName = `${boss.bossFirstName} ${boss.bossLastName}`.toLowerCase()
         return (
         fullName.includes(searchQuery.toLowerCase()) || boss.position?.toLowerCase().includes(searchQuery.toLowerCase())
         )
      }) || []
      
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (open && !(event.target as Element)?.closest('[data-popover-wrapper]')) {
          setOpen(false)
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [open])

   return (
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
         <div className={`${!isBossPage ? "pl-32" : ""}`} />
         <div className={`flex-1 flex ${isBossPage ? "justify-start gap-4 items-center" : "justify-center"}`}>
            <Link className="flex items-center group" href="/">
               <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 dark:from-primary dark:to-blue-400 flex items-center justify-center shadow-md transform transition-transform group-hover:scale-105">
                  <Star className="h-6 w-6 text-white" />
               </div>
               <span className="ml-2 text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent animate-gradientShift relative group-hover:after:w-full after:absolute after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-purple-600 dark:after:from-primary dark:after:to-blue-400 after:bottom-0 after:left-0 after:w-0 after:transition-all">
                  Bossy
               </span>
            </Link>

            {isBossPage && (
               <div className="w-full flex justify-center">
                  <div className="w-full max-w-xl">
                     <Popover open={open} onOpenChange={setOpen}>
                        <div className="flex items-center gap-2 w-full">
                           <PopoverTrigger asChild>
                           <div className="relative flex-1">
                              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                 type="text"
                                 placeholder="Search for a boss"
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                                 onClick={() => setOpen(true)}
                                 className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-6 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                              />
                           </div>
                           </PopoverTrigger>
                  
                           <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                           at &nbsp;
                              <span className="underline inline-block hover:scale-105 transition-transform duration-200 ease-in-out">
                                 {bossInfo?.Company?.companyName}
                              </span>
                           </span>
                        </div>
                  
                        <PopoverContent
                           className="p-0 w-full max-w-xl"
                           align="start"
                           sideOffset={5}
                           style={{ width: 'var(--radix-popover-trigger-width)' }}
                        >
                           <div className="rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
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
                                          <div
                                             className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                                          >
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
                        </PopoverContent>
                     </Popover>
                  </div>
               </div>
            )}
         </div>

         {!isSignedIn ? (
            <div className="flex items-center gap-3">
               <SignInButton mode="modal">
                  <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:shadow-md hover:border-primary/50 transition-all duration-300"
                  >
                  Sign In
                  </Button>
               </SignInButton>
               <SignUpButton mode="modal">
                  <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-primary to-purple-500 dark:from-primary dark:to-blue-400 hover:shadow-md hover:border-primary/50 transition-all duration-300"
                  >
                  Sign Up
                  </Button>
               </SignUpButton>
            </div>
         ) : (
            <div className="flex items-center gap-3">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                  <Button
                     variant="ghost"
                     className="flex items-center gap-2 hover:bg-muted px-3 rounded-full transition-all duration-300 hover:shadow-sm"
                  >
                     <Avatar className="h-8 w-8 border-2 border-primary/20">
                        <AvatarImage src={imageUrl || "/placeholder.svg"} alt={`${firstname} ${lastname}`} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-500/80 text-white">
                        {firstname?.charAt(0)}
                        {lastname?.charAt(0)}
                        </AvatarFallback>
                     </Avatar>
                     <span className="font-medium hidden sm:inline">
                        {firstname} {lastname}
                     </span>
                  </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg"
                  >
                  <div className="px-3 py-2 mb-2">
                     <p className="text-sm font-medium">
                        {firstname} {lastname}
                     </p>
                     <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <DropdownMenuItem asChild>
                     <Link
                        href={`/profile/${user?.id}`}
                        className="flex items-center gap-2 cursor-pointer rounded-lg hover:bg-primary/10 transition-colors duration-200"
                     >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                     </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                     <DropdownMenuItem onClick={refetch} asChild>
                        <Link
                        href="/admin"
                        className="flex items-center gap-2 cursor-pointer rounded-lg hover:bg-primary/10 transition-colors duration-200"
                        >
                        <ShieldAlert className="h-4 w-4" />
                        <span>Admin Panel</span>
                        </Link>
                     </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                     onClick={() => signOut()}
                     className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive rounded-lg hover:bg-destructive/10 transition-colors duration-200"
                  >
                     <LogOut className="h-4 w-4" />
                     <span>Sign out</span>
                  </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         )}
      </header>
   )
}

export default Navbar