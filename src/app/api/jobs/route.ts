import { NextRequest, NextResponse } from 'next/server'
import { getJobScrollJobs, JobFilters } from '@/lib/queries/jobs'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const filters: JobFilters = {
    search: searchParams.get('search') || undefined,
    location: searchParams.get('location') || undefined,
    remoteOnly: searchParams.get('remote') === 'true',
    salaryMin: searchParams.get('salaryMin')
      ? parseInt(searchParams.get('salaryMin')!)
      : undefined,
    verifiedOnly: searchParams.get('verified') === 'true',
    experienceLevels: searchParams.get('levels')
      ?.split(',')
      .filter(Boolean) as JobFilters['experienceLevels']
  }

  const cursor = searchParams.get('cursor') || undefined
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    const result = await getJobScrollJobs(filters, cursor, limit)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}
