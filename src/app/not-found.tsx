import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-5xl font-bold text-teal-600">404</p>
        <h2 className="text-2xl font-semibold text-slate-800">Page not found</h2>
        <p className="text-slate-500 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
        <Link href="/">Browse jobs</Link>
      </Button>
    </div>
  )
}
