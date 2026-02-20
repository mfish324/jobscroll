'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800">Something went wrong</h2>
        <p className="text-slate-500 max-w-sm">
          We couldn&apos;t load the job listings. This is usually a temporary issue.
        </p>
      </div>
      <Button
        onClick={reset}
        className="bg-teal-600 hover:bg-teal-700 text-white"
      >
        Try again
      </Button>
    </div>
  )
}
