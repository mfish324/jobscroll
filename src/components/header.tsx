import Link from 'next/link'
import { SettingsModal } from '@/components/settings-modal'

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold text-slate-800 tracking-tight">
            JobScroll
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-500">
          <Link href="/about" className="hover:text-slate-700 transition-colors">
            About
          </Link>
          <SettingsModal />
        </nav>
      </div>
    </header>
  )
}
