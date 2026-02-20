import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { IntakeModal } from './intake-modal'
import { getPreferences } from '@/lib/preferences'

const { mockReplace } = vi.hoisted(() => ({ mockReplace: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

describe('IntakeModal', () => {
  beforeEach(() => {
    localStorage.clear()
    mockReplace.mockClear()
  })

  // ── Visibility ────────────────────────────────────────────────────────────

  it('shows on first visit when no preferences are saved', () => {
    render(<IntakeModal />)
    expect(screen.getByText('Welcome to JobScroll')).toBeInTheDocument()
  })

  it('does not show when preferences already exist in localStorage', () => {
    localStorage.setItem('jobscroll_preferences', JSON.stringify({ intent: 'browsing' }))
    render(<IntakeModal />)
    expect(screen.queryByText('Welcome to JobScroll')).not.toBeInTheDocument()
  })

  // ── Step 1: intent ────────────────────────────────────────────────────────

  it('"Just browsing" saves browsing intent and closes the modal', async () => {
    const user = userEvent.setup()
    render(<IntakeModal />)

    await user.click(screen.getByText('Just browsing'))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
    expect(getPreferences()?.intent).toBe('browsing')
  })

  it('"Actively looking" advances to the preferences step', async () => {
    const user = userEvent.setup()
    render(<IntakeModal />)

    await user.click(screen.getByText('Actively looking'))

    expect(screen.getByText("Let's tune your feed")).toBeInTheDocument()
    expect(screen.queryByText('Welcome to JobScroll')).not.toBeInTheDocument()
  })

  it('closing via the X button defaults to browsing intent', async () => {
    const user = userEvent.setup()
    render(<IntakeModal />)

    await user.click(screen.getByRole('button', { name: 'Close' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
    expect(getPreferences()?.intent).toBe('browsing')
  })

  // ── Step 2: preferences ───────────────────────────────────────────────────

  it('toggling experience levels adds and removes them', async () => {
    const user = userEvent.setup()
    render(<IntakeModal />)
    await user.click(screen.getByText('Actively looking'))

    const senior = screen.getByRole('button', { name: 'Senior' })
    await user.click(senior)
    await user.click(screen.getByRole('button', { name: 'Mid' }))
    // deselect Senior
    await user.click(senior)

    await user.click(screen.getByRole('button', { name: 'Show my jobs' }))

    const saved = getPreferences()
    expect(saved?.levels).toContain('MID')
    expect(saved?.levels).not.toContain('SENIOR')
  })

  it('"Show my jobs" saves preferences and calls router.replace with params', async () => {
    const user = userEvent.setup()
    render(<IntakeModal />)
    await user.click(screen.getByText('Actively looking'))

    await user.click(screen.getByRole('button', { name: 'Senior' }))
    await user.click(screen.getByRole('button', { name: 'Remote only' }))
    await user.click(screen.getByRole('button', { name: 'Show my jobs' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )

    const saved = getPreferences()
    expect(saved?.intent).toBe('looking')
    expect(saved?.levels).toContain('SENIOR')
    expect(saved?.remote).toBe(true)

    expect(mockReplace).toHaveBeenCalledOnce()
    const [url] = mockReplace.mock.calls[0]
    expect(url).toContain('levels=SENIOR')
    expect(url).toContain('remote=true')
  })

  it('"Show my jobs" without any selections does not call router.replace', async () => {
    const user = userEvent.setup()
    render(<IntakeModal />)
    await user.click(screen.getByText('Actively looking'))
    await user.click(screen.getByRole('button', { name: 'Show my jobs' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('"Skip for now" saves looking intent without applying any URL params', async () => {
    const user = userEvent.setup()
    render(<IntakeModal />)
    await user.click(screen.getByText('Actively looking'))
    await user.click(screen.getByRole('button', { name: 'Skip for now' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )

    const saved = getPreferences()
    expect(saved?.intent).toBe('looking')
    expect(saved?.levels).toHaveLength(0)
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
