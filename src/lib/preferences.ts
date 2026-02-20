export interface UserPreferences {
  intent: 'browsing' | 'looking'
  levels: string[]
  remote: boolean
  salaryMin: number | null
  search: string
}

const KEY = 'jobscroll_preferences'

export function getPreferences(): UserPreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as UserPreferences) : null
  } catch {
    return null
  }
}

export function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem(KEY, JSON.stringify(prefs))
}

export function clearPreferences(): void {
  localStorage.removeItem(KEY)
}

export function preferencesToParams(prefs: UserPreferences): URLSearchParams {
  const params = new URLSearchParams()
  if (prefs.levels.length) params.set('levels', prefs.levels.join(','))
  if (prefs.remote) params.set('remote', 'true')
  if (prefs.salaryMin) params.set('salaryMin', String(prefs.salaryMin))
  if (prefs.search.trim()) params.set('search', prefs.search.trim())
  return params
}
