import Link from 'next/link'
import React from 'react'

const Footer = () => {
   return (
      <footer className="flex flex-col gap-2 sm:flex-row py-3 sm:py-4 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">© 2025 Bossy. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-3 sm:gap-4">
          <Link className="text-[10px] sm:text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-[10px] sm:text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
   )
}

export default Footer