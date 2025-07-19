import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
        page not found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Sorry, the page you requested does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        back homepage
      </Link>
    </div>
  )
} 