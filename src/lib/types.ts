export interface Job {
  id: string
  title: string
  company: string
  companyLogo: string | null
  location: string | null
  jobType: string | null
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE' | null
  category: string
  description: string
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string | null
  salaryPeriod: string | null
  remote: boolean
  applyUrl: string | null
  audienceTags: string[]
  isRjrpVerified: boolean
  isActive: boolean
  postedAt: Date | string
  createdAt: Date | string
}
