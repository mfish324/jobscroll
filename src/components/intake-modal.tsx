'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { savePreferences, preferencesToParams } from '@/lib/preferences'

export function IntakeModal() {
  const router = useRouter()
  // Safe: this component is always loaded with ssr:false, so localStorage is available
  const [open, setOpen] = useState(() => !localStorage.getItem('jobscroll_preferences'))
  const [step, setStep] = useState<'intent' | 'preferences'>('intent')

  // Preference form state
  const [levels, setLevels] = useState<string[]>([])
  const [remote, setRemote] = useState(false)
  const [salaryMin, setSalaryMin] = useState('')
  const [search, setSearch] = useState('')

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // Closing without a choice defaults to browsing so intake doesn't re-show
      if (!localStorage.getItem('jobscroll_preferences')) {
        savePreferences({ intent: 'browsing', levels: [], remote: false, salaryMin: null, search: '' })
      }
      setOpen(false)
    }
  }

  const handleBrowsing = () => {
    savePreferences({ intent: 'browsing', levels: [], remote: false, salaryMin: null, search: '' })
    setOpen(false)
  }

  const handleLooking = () => {
    setStep('preferences')
  }

  const applyAndClose = (prefs: Parameters<typeof savePreferences>[0]) => {
    savePreferences(prefs)
    const params = preferencesToParams(prefs)
    if (params.toString()) {
      router.replace(`/?${params.toString()}`, { scroll: false })
    }
    setOpen(false)
  }

  const handleSave = () => {
    applyAndClose({
      intent: 'looking',
      levels,
      remote,
      salaryMin: salaryMin ? parseInt(salaryMin) : null,
      search,
    })
  }

  const handleSkip = () => {
    savePreferences({ intent: 'looking', levels: [], remote: false, salaryMin: null, search: '' })
    setOpen(false)
  }

  const toggleLevel = (level: string) => {
    setLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 'intent' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Welcome to JobScroll</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-slate-500 text-center -mt-1">
              What brings you here today?
            </p>
            <div className="flex flex-col gap-3 mt-1">
              <button
                onClick={handleBrowsing}
                className="text-left p-4 rounded-lg border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all group"
              >
                <p className="font-medium text-slate-800 group-hover:text-teal-700">
                  Just browsing
                </p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Keeping up with what&apos;s out there
                </p>
              </button>
              <button
                onClick={handleLooking}
                className="text-left p-4 rounded-lg border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all group"
              >
                <p className="font-medium text-slate-800 group-hover:text-teal-700">
                  Actively looking
                </p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Ready to explore new opportunities
                </p>
              </button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Let&apos;s tune your feed</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-5">
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
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Minimum salary{' '}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </p>
                <Select value={salaryMin || 'none'} onValueChange={v => setSalaryMin(v === 'none' ? '' : v)}>
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
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Keywords{' '}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </p>
                <Input
                  placeholder="e.g. React, DevOps, fintech..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-white border-slate-300 focus-visible:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={handleSkip}
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip for now
              </button>
              <Button
                onClick={handleSave}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Show my jobs
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
