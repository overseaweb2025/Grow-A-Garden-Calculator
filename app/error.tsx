'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">500</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
        server error
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Sorry, there is a problem with the server. Please try again later.
      </p>
      <div className="flex gap-4 mt-6">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          retry
        </button>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          back homepage
        </Link>
      </div>
    </div>
  )
} 