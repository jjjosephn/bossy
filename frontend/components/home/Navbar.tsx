"use client"
import { Button } from "../ui/button"
import Link from "next/link"
import { LogOut, Star, User, Settings, ShieldAlert } from "lucide-react"
import { SignInButton, SignUpButton, useClerk, useUser } from "@clerk/nextjs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCheckUserExistsMutation } from "@/app/state/api"
import { useEffect } from "react"

const Navbar = () => {
   const { isSignedIn, user } = useUser()
   const { signOut } = useClerk()
   const [checkUser] = useCheckUserExistsMutation()
   const firstname = user?.firstName
   const lastname = user?.lastName
   const imageUrl = user?.imageUrl
   
   const isAdmin = user?.publicMetadata.role === 'admin'

   console.log(user)

   useEffect(() => {
      if (isSignedIn) {
         checkUser({ 
            userId: user?.id,
            firstName: firstname ?? "",
            lastName: lastname ?? "",
            email: user?.primaryEmailAddress?.emailAddress ?? ""
         })
      }
   }, [isSignedIn, user?.id])

   return (
      <header className="px-6 lg:px-8 h-20 flex items-center justify-between sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
         <div className="w-36 flex items-center"/>

         <Link className="flex items-center justify-center group" href="/">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 dark:from-primary dark:to-blue-400 flex items-center justify-center shadow-md transform transition-transform group-hover:scale-105">
               <Star className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent animate-gradientShift relative group-hover:after:w-full after:absolute after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-purple-600 dark:after:from-primary dark:after:to-blue-400 after:bottom-0 after:left-0 after:w-0 after:transition-all">
               Bossy
            </span>
         </Link>

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
                        <AvatarImage src={imageUrl} alt={`${firstname} ${lastname}`} />
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
                  <DropdownMenuContent align="end" className="w-56 p-2 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg">
                  <div className="px-3 py-2 mb-2">
                     <p className="text-sm font-medium">{firstname} {lastname}</p>
                     <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <DropdownMenuItem asChild>
                     <Link 
                        href="/profile" 
                        className="flex items-center gap-2 cursor-pointer rounded-lg hover:bg-primary/10 transition-colors duration-200"
                     >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                     </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                     <DropdownMenuItem asChild>
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