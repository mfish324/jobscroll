'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getPreferences, preferencesToParams } from '@/lib/preferences'

export function PreferencesApplier() {
  const router = useRouter()

  useEffect(() => {
    // Only apply if arriving with no URL filters already set
    if (window.location.search) return

    const prefs = getPreferences()
    if (!prefs) return

    const params = preferencesToParams(prefs)
    if (params.toString()) {
      router.replace(`/?${params.toString()}`, { scroll: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
