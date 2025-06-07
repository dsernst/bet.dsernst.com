import type { Metadata } from 'next'
import './globals.css'
import { title, description } from './Content'

export const metadata: Metadata = { title, description }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
