import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import { ThemeProvider } from './components/ThemeProvider'
import { LanguageProvider } from './components/LanguageProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ClaimEase',
  description: 'AI-powered health insurance claim verification',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-blue-100 dark:from-navy-900 dark:to-black">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

