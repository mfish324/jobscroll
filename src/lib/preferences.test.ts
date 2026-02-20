import { describe, it, expect, beforeEach } from 'vitest'
import {
  getPreferences,
  savePreferences,
  clearPreferences,
  preferencesToParams,
  type UserPreferences,
} from './preferences'

const base: UserPreferences = {
  intent: 'looking',
  levels: [],
  remote: false,
  salaryMin: null,
  search: '',
}

describe('preferencesToParams', () => {
  it('returns empty params when no filters are set', () => {
    const params = preferencesToParams(base)
    expect(params.toString()).toBe('')
  })

  it('includes levels as comma-joined string', () => {
    const params = preferencesToParams({ ...base, levels: ['MID', 'SENIOR'] })
    expect(params.get('levels')).toBe('MID,SENIOR')
  })

  it('includes remote=true when remote is set', () => {
    const params = preferencesToParams({ ...base, remote: true })
    expect(params.get('remote')).toBe('true')
  })

  it('omits remote when false', () => {
    const params = preferencesToParams({ ...base, remote: false })
    expect(params.has('remote')).toBe(false)
  })

  it('includes salaryMin when set', () => {
    const params = preferencesToParams({ ...base, salaryMin: 100000 })
    expect(params.get('salaryMin')).toBe('100000')
  })

  it('omits salaryMin when null', () => {
    const params = preferencesToParams({ ...base, salaryMin: null })
    expect(params.has('salaryMin')).toBe(false)
  })

  it('includes trimmed search when set', () => {
    const params = preferencesToParams({ ...base, search: '  React  ' })
    expect(params.get('search')).toBe('React')
  })

  it('omits search when empty or whitespace', () => {
    expect(preferencesToParams({ ...base, search: '' }).has('search')).toBe(false)
    expect(preferencesToParams({ ...base, search: '   ' }).has('search')).toBe(false)
  })

  it('combines all active filters', () => {
    const params = preferencesToParams({
      intent: 'looking',
      levels: ['SENIOR'],
      remote: true,
      salaryMin: 75000,
      search: 'backend',
    })
    expect(params.get('levels')).toBe('SENIOR')
    expect(params.get('remote')).toBe('true')
    expect(params.get('salaryMin')).toBe('75000')
    expect(params.get('search')).toBe('backend')
  })
})

describe('localStorage round-trip', () => {
  beforeEach(() => localStorage.clear())

  it('getPreferences returns null when nothing is saved', () => {
    expect(getPreferences()).toBeNull()
  })

  it('savePreferences + getPreferences round-trips correctly', () => {
    const prefs: UserPreferences = {
      intent: 'looking',
      levels: ['SENIOR', 'EXECUTIVE'],
      remote: true,
      salaryMin: 120000,
      search: 'typescript',
    }
    savePreferences(prefs)
    expect(getPreferences()).toEqual(prefs)
  })

  it('clearPreferences removes saved preferences', () => {
    savePreferences(base)
    clearPreferences()
    expect(getPreferences()).toBeNull()
  })

  it('overwrites existing preferences on save', () => {
    savePreferences({ ...base, intent: 'browsing' })
    savePreferences({ ...base, intent: 'looking', levels: ['MID'] })
    const result = getPreferences()
    expect(result?.intent).toBe('looking')
    expect(result?.levels).toEqual(['MID'])
  })
})
