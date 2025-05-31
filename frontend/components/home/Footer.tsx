import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center py-4 w-full px-4 md:px-6 border-t-[2px] border-gray-300 dark:border-gray-700">
      <nav className="mb-1">
        <Link 
          className="text-xs sm:text-md font-bold hover:underline underline-offset-4 text-gray-500 dark:text-gray-400"
          href="/guidelines"
        >
          Site Guidelines
        </Link>
      </nav>
      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
        © 2025 Bossy. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer