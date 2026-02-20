'use client'

import dynamic from 'next/dynamic'

const IntakeModal = dynamic(
  () => import('@/components/intake-modal').then(m => ({ default: m.IntakeModal })),
  { ssr: false }
)

const PreferencesApplier = dynamic(
  () => import('@/components/preferences-applier').then(m => ({ default: m.PreferencesApplier })),
  { ssr: false }
)

export function ClientModals() {
  return (
    <>
      <IntakeModal />
      <PreferencesApplier />
    </>
  )
}
