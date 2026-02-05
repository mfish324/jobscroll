'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { JobCard } from './job-card'
import { JobCardSkeleton } from './job-card-skeleton'
import { Job } from '@/lib/types'

interface JobFeedProps {
  initialJobs: Job[]
  initialCursor?: string
  filters?: Record<string, string>
}

export function JobFeed({ initialJobs, initialCursor, filters = {} }: JobFeedProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [cursor, setCursor] = useState<string | undefined>(initialCursor)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(!!initialCursor)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Reset when filters change
  useEffect(() => {
    setJobs(initialJobs)
    setCursor(initialCursor)
    setHasMore(!!initialCursor)
  }, [initialJobs, initialCursor])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return

    setLoading(true)
    try {
      const params = new URLSearchParams(filters)
      params.set('cursor', cursor)

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data = await response.json()

      if (data.jobs?.length) {
        setJobs(prev => [...prev, ...data.jobs])
        setCursor(data.nextCursor)
        setHasMore(!!data.nextCursor)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more jobs:', error)
    } finally {
      setLoading(false)
    }
  }, [cursor, hasMore, loading, filters])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, loadMore])

  if (jobs.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No jobs found matching your criteria.</p>
        <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

      {/* Loading skeletons */}
      {loading && (
        <>
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
        </>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-4" />

      {/* End of feed message */}
      {!hasMore && jobs.length > 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">You've reached the end</p>
        </div>
      )}
    </div>
  )
}
