'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { LanguageProvider } from '@/contexts/LanguageContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ClerkProvider>
  )
}
