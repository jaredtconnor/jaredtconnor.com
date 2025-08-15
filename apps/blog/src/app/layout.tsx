import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { SiteLayout } from '@/components/Layouts'
import { GlobalNavigationProvider } from '@/components/providers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata = {
  title: 'Jared Connor - Designer & Developer',
  description: 'Personal blog and portfolio of Jared Connor. Developer, data engineer, and financial analyst building scalable systems.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={cn('font-sans antialiased', inter.className)}>
        <GlobalNavigationProvider>
          <SiteLayout>
            {children}
          </SiteLayout>
        </GlobalNavigationProvider>
      </body>
    </html>
  )
}