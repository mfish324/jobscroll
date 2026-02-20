import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SettingsModal } from './settings-modal'
import { savePreferences, getPreferences } from '@/lib/preferences'

const { mockPush } = vi.hoisted(() => ({ mockPush: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}))

describe('SettingsModal', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
  })

  const openModal = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole('button', { name: 'Open preferences' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  }

  // ── Opening ───────────────────────────────────────────────────────────────

  it('renders a gear icon button', () => {
    render(<SettingsModal />)
    expect(screen.getByRole('button', { name: 'Open preferences' })).toBeInTheDocument()
  })

  it('opens the preferences dialog on click', async () => {
    const user = userEvent.setup()
    render(<SettingsModal />)
    await openModal(user)
    expect(screen.getByText('Preferences')).toBeInTheDocument()
  })

  // ── Loading saved preferences ─────────────────────────────────────────────

  it('loads saved levels when opened', async () => {
    savePreferences({
      intent: 'looking',
      levels: ['SENIOR'],
      remote: false,
      salaryMin: null,
      search: '',
    })
    const user = userEvent.setup()
    render(<SettingsModal />)
    await openModal(user)

    // The Senior button should appear active (teal style)
    const seniorBtn = screen.getByRole('button', { name: 'Senior' })
    expect(seniorBtn).toHaveClass('bg-teal-600')
  })

  it('reflects saved remote preference when opened', async () => {
    savePreferences({
      intent: 'looking',
      levels: [],
      remote: true,
      salaryMin: null,
      search: '',
    })
    const user = userEvent.setup()
    render(<SettingsModal />)
    await openModal(user)

    expect(screen.getByRole('button', { name: 'Remote only' })).toHaveClass('bg-teal-600')
  })

  // ── Saving ────────────────────────────────────────────────────────────────

  it('Save writes preferences to localStorage and calls router.push', async () => {
    const user = userEvent.setup()
    render(<SettingsModal />)
    await openModal(user)

    await user.click(screen.getByRole('button', { name: 'Executive' }))
    await user.click(screen.getByRole('button', { name: 'Remote only' }))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )

    const saved = getPreferences()
    expect(saved?.levels).toContain('EXECUTIVE')
    expect(saved?.remote).toBe(true)

    expect(mockPush).toHaveBeenCalledOnce()
    const [url] = mockPush.mock.calls[0]
    expect(url).toContain('levels=EXECUTIVE')
    expect(url).toContain('remote=true')
  })

  it('Save with no filters pushes to bare pathname', async () => {
    const user = userEvent.setup()
    render(<SettingsModal />)
    await openModal(user)

    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
    expect(mockPush).toHaveBeenCalledWith('/', expect.any(Object))
  })

  // ── Clearing ──────────────────────────────────────────────────────────────

  it('"Clear preferences" removes localStorage entry and pushes to bare pathname', async () => {
    savePreferences({
      intent: 'looking',
      levels: ['MID'],
      remote: true,
      salaryMin: 100000,
      search: 'react',
    })
    const user = userEvent.setup()
    render(<SettingsModal />)
    await openModal(user)

    await user.click(screen.getByRole('button', { name: 'Clear preferences' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
    expect(getPreferences()).toBeNull()
    expect(mockPush).toHaveBeenCalledWith('/', expect.any(Object))
  })
})
