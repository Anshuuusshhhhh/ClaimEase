import Link from 'next/link'
import { ModeToggle } from './ModeToggle'
import { LanguageSelector } from './LanguageSelector'

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          ClaimEase
        </Link>
        <nav className="flex items-center space-x-4">
          <LanguageSelector />
          <ModeToggle />
          <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors">
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}

