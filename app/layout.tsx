import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

import { ThemeProvider } from '@/components/provider/theme-provider'
import { ourFileRouter } from './api/uploadthing/core'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ani22',
  description: '모든 에니메이션이 한곳에! ani22 에서 작품을 감상하세요!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Toaster />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
