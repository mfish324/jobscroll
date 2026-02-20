'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Settings } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getPreferences,
  savePreferences,
  clearPreferences,
  preferencesToParams,
} from '@/lib/preferences'

export function SettingsModal() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const [intent, setIntent] = useState<'browsing' | 'looking'>('browsing')
  const [levels, setLevels] = useState<string[]>([])
  const [remote, setRemote] = useState(false)
  const [salaryMin, setSalaryMin] = useState('')
  const [search, setSearch] = useState('')

  const handleOpen = (next: boolean) => {
    if (next) {
      const prefs = getPreferences()
      setIntent(prefs?.intent ?? 'browsing')
      setLevels(prefs?.levels ?? [])
      setRemote(prefs?.remote ?? false)
      setSalaryMin(prefs?.salaryMin ? String(prefs.salaryMin) : '')
      setSearch(prefs?.search ?? '')
    }
    setOpen(next)
  }

  const handleSave = () => {
    const prefs = {
      intent,
      levels,
      remote,
      salaryMin: salaryMin ? parseInt(salaryMin) : null,
      search,
    }
    savePreferences(prefs)
    const params = preferencesToParams(prefs)
    router.push(
      params.toString() ? `${pathname}?${params.toString()}` : pathname,
      { scroll: false }
    )
    setOpen(false)
  }

  const handleClear = () => {
    clearPreferences()
    router.push(pathname, { scroll: false })
    setOpen(false)
  }

  const toggleLevel = (level: string) => {
    setLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    )
  }

  return (
    <>
      <button
        onClick={() => handleOpen(true)}
        className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Open preferences"
      >
        <Settings className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preferences</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            {/* Intent */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">I&apos;m currently</p>
              <div className="flex gap-2">
                <Button
                  variant={intent === 'browsing' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIntent('browsing')}
                  className={intent === 'browsing'
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }
                >
                  Just browsing
                </Button>
                <Button
                  variant={intent === 'looking' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIntent('looking')}
                  className={intent === 'looking'
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }
                >
                  Actively looking
                </Button>
              </div>
            </div>

            {/* Experience level */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Experience level</p>
              <div className="flex gap-2 flex-wrap">
                {(['MID', 'SENIOR', 'EXECUTIVE'] as const).map((level) => {
                  const labels = { MID: 'Mid', SENIOR: 'Senior', EXECUTIVE: 'Executive' }
                  const active = levels.includes(level)
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
              </div>
            </div>

            {/* Work style */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Work style</p>
              <div className="flex gap-2">
                <Button
                  variant={remote ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRemote(true)}
                  className={remote
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }
                >
                  Remote only
                </Button>
                <Button
                  variant={!remote ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRemote(false)}
                  className={!remote
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                  }
                >
                  Open to both
                </Button>
              </div>
            </div>

            {/* Salary */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Minimum salary</p>
              <Select
                value={salaryMin || 'none'}
                onValueChange={v => setSalaryMin(v === 'none' ? '' : v)}
              >
                <SelectTrigger className="w-36 bg-white border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No minimum</SelectItem>
                  <SelectItem value="50000">$50k+</SelectItem>
                  <SelectItem value="75000">$75k+</SelectItem>
                  <SelectItem value="100000">$100k+</SelectItem>
                  <SelectItem value="150000">$150k+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Keywords */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Keywords</p>
              <Input
                placeholder="e.g. React, DevOps, fintech..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-white border-slate-300 focus-visible:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-1">
            <button
              onClick={handleClear}
              className="text-sm text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear preferences
            </button>
            <Button
              onClick={handleSave}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
