import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export interface JobFilters {
  search?: string
  location?: string
  remoteOnly?: boolean
  salaryMin?: number
  experienceLevels?: ('MID' | 'SENIOR' | 'EXECUTIVE')[]
  verifiedOnly?: boolean
}

export async function getJobScrollJobs(
  filters: JobFilters = {},
  cursor?: string,
  limit: number = 20
) {
  const where: Prisma.JobListingWhereInput = {
    isActive: true
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { company: { contains: filters.search, mode: 'insensitive' } }
    ]
  }

  if (filters.location) {
    where.location = { contains: filters.location, mode: 'insensitive' }
  }

  if (filters.remoteOnly) {
    where.remote = true
  }

  if (filters.salaryMin) {
    where.salaryMax = { gte: filters.salaryMin }
  }

  if (filters.experienceLevels?.length) {
    where.experienceLevel = { in: filters.experienceLevels }
  }

  if (filters.verifiedOnly) {
    where.isRjrpVerified = true
  }

  const jobs = await prisma.jobListing.findMany({
    where,
    orderBy: { postedAt: 'desc' },
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 })
  })

  const hasMore = jobs.length > limit
  const data = hasMore ? jobs.slice(0, -1) : jobs
  const nextCursor = hasMore ? data[data.length - 1]?.id : undefined

  return { jobs: data, nextCursor }
}
