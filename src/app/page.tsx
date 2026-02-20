import { Suspense } from 'react'
import { getJobScrollJobs, JobFilters } from '@/lib/queries/jobs'
import { JobFeed } from '@/components/job-feed'
import { FiltersBar } from '@/components/filters-bar'
import { JobCardSkeleton } from '@/components/job-card-skeleton'
import { ClientModals } from '@/components/client-modals'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function JobList({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const filters: JobFilters = {
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    location: typeof searchParams.location === 'string' ? searchParams.location : undefined,
    remoteOnly: searchParams.remote === 'true',
    salaryMin: typeof searchParams.salaryMin === 'string' ? parseInt(searchParams.salaryMin) : undefined,
    verifiedOnly: searchParams.verified === 'true',
    experienceLevels: typeof searchParams.levels === 'string'
      ? searchParams.levels.split(',').filter(Boolean) as JobFilters['experienceLevels']
      : undefined,
  }

  // Build filter params for client-side pagination
  const filterParams: Record<string, string> = {}
  if (filters.search) filterParams.search = filters.search
  if (filters.location) filterParams.location = filters.location
  if (filters.remoteOnly) filterParams.remote = 'true'
  if (filters.salaryMin) filterParams.salaryMin = filters.salaryMin.toString()
  if (filters.verifiedOnly) filterParams.verified = 'true'
  if (filters.experienceLevels?.length) filterParams.levels = filters.experienceLevels.join(',')

  const { jobs, nextCursor } = await getJobScrollJobs(filters)

  return (
    <JobFeed
      initialJobs={jobs}
      initialCursor={nextCursor}
      filters={filterParams}
    />
  )
}

function JobListSkeleton() {
  return (
    <div className="space-y-4">
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
    </div>
  )
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams

  return (
    <div className="min-h-screen">
      <ClientModals />

      <Suspense fallback={null}>
        <FiltersBar />
      </Suspense>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <Suspense fallback={<JobListSkeleton />}>
          <JobList searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </div>
  )
}
