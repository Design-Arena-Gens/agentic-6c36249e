import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { AppNav } from '@/components/layout/AppNav'

export const metadata: Metadata = {
  title: 'RCPS - Professional Services Project Management',
  description: 'Manage projects, SOWs, CRs, invoicing, and profitability.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <AppNav />
          <main className="container py-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
