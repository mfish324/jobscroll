import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} JobScroll</p>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-700 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">
              Privacy
            </Link>
            <a
              href="https://rjrp.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-700 transition-colors"
            >
              RJRP
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
