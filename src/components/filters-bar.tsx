'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect, useCallback, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, CheckCircle } from 'lucide-react'

export function FiltersBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for inputs
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')

  // Values derived directly from URL
  const remoteOnly = searchParams.get('remote') === 'true'
  const salaryMin = searchParams.get('salaryMin') || ''
  const verifiedOnly = searchParams.get('verified') === 'true'
  const activeLevels = new Set(
    (searchParams.get('levels') || '').split(',').filter(Boolean)
  )

  // Update URL with new params
  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'false') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }, [searchParams, pathname, router])

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get('search') || '')) {
        updateFilters({ search: search || null })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search, searchParams, updateFilters])

  // Debounced location update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (location !== (searchParams.get('location') || '')) {
        updateFilters({ location: location || null })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [location, searchParams, updateFilters])

  const clearAll = () => {
    setSearch('')
    setLocation('')
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
  }

  const toggleLevel = (level: string) => {
    const next = new Set(activeLevels)
    if (next.has(level)) {
      next.delete(level)
    } else {
      next.add(level)
    }
    updateFilters({ levels: next.size > 0 ? [...next].join(',') : null })
  }

  const hasFilters = search || location || remoteOnly || salaryMin || verifiedOnly || activeLevels.size > 0

  return (
    <div className="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-sm border-b border-slate-200 py-4">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col gap-3">
          {/* Search and Location */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-slate-200 focus-visible:ring-teal-500"
              />
            </div>
            <Input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-40 bg-white border-slate-200 focus-visible:ring-teal-500"
            />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Remote toggle */}
            <Button
              variant={remoteOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ remote: remoteOnly ? null : 'true' })}
              className={remoteOnly
                ? 'bg-teal-600 hover:bg-teal-700 text-white'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
              }
            >
              Remote only
            </Button>

            {/* Salary minimum */}
            <Select
              value={salaryMin}
              onValueChange={(value) => updateFilters({ salaryMin: value || null })}
            >
              <SelectTrigger className="w-32 h-8 text-sm bg-white border-slate-300">
                <SelectValue placeholder="Min salary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50000">$50k+</SelectItem>
                <SelectItem value="75000">$75k+</SelectItem>
                <SelectItem value="100000">$100k+</SelectItem>
                <SelectItem value="150000">$150k+</SelectItem>
              </SelectContent>
            </Select>

            {/* Verified toggle */}
            <Button
              variant={verifiedOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters({ verified: verifiedOnly ? null : 'true' })}
              className={verifiedOnly
                ? 'bg-teal-600 hover:bg-teal-700 text-white gap-1'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100 gap-1'
              }
            >
              <CheckCircle className="h-3 w-3" />
              Verified only
            </Button>

            {/* Experience level toggles */}
            {(['MID', 'SENIOR', 'EXECUTIVE'] as const).map((level) => {
              const active = activeLevels.has(level)
              const labels: Record<string, string> = { MID: 'Mid', SENIOR: 'Senior', EXECUTIVE: 'Executive' }
              return (
                <Button
                  key={level}
                  variant={active ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleLevel(level)}
                  className={active
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }
                >
                  {labels[level]}
                </Button>
              )
            })}

            {/* Clear all */}
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-slate-500 hover:text-slate-700 gap-1"
              >
                <X className="h-3 w-3" />
                Clear all
              </Button>
            )}

            {/* Loading indicator */}
            {isPending && (
              <span className="text-xs text-slate-400 ml-auto">Updating...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
