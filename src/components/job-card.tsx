'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle, MapPin, Briefcase, DollarSign } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Job } from '@/lib/types'
import { JobDetailModal } from '@/components/job-detail-modal'

interface JobCardProps {
  job: Job
}

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return 'Salary not disclosed'

  const formatK = (n: number) => {
    if (n >= 1000) return `$${Math.round(n / 1000)}k`
    return `$${n}`
  }

  if (min && max) {
    return `${formatK(min)} - ${formatK(max)}`
  }
  if (min) return `${formatK(min)}+`
  if (max) return `Up to ${formatK(max)}`
  return 'Salary not disclosed'
}

function formatExperienceLevel(level: string | null): string {
  if (!level) return ''
  const labels: Record<string, string> = {
    'ENTRY': 'Entry Level',
    'MID': 'Mid Level',
    'SENIOR': 'Senior',
    'EXECUTIVE': 'Executive'
  }
  return labels[level] || level
}

export function JobCard({ job }: JobCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const postedDate = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })
  const salary = formatSalary(job.salaryMin, job.salaryMax)
  const experienceLabel = formatExperienceLevel(job.experienceLevel)

  return (
    <>
      <Card
        className="p-6 hover:shadow-md transition-shadow cursor-pointer group bg-white border-slate-200"
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setModalOpen(true)
          }
        }}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Company */}
            <p className="text-sm text-slate-500 font-medium mb-1">{job.company}</p>

            {/* Title */}
            <h3 className="text-lg font-semibold text-slate-800 mb-3 group-hover:text-teal-700 transition-colors">
              {job.title}
            </h3>

            {/* Details row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
              {/* Location */}
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {job.location}
                </span>
              )}

              {/* Salary */}
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-slate-400" />
                {salary}
              </span>

              {/* Experience */}
              {experienceLabel && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  {experienceLabel}
                </span>
              )}
            </div>
          </div>

          {/* Right side badges */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* Verified badge */}
            {job.isRjrpVerified && (
              <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200 gap-1">
                <CheckCircle className="h-3 w-3" />
                RJRP Verified
              </Badge>
            )}

            {/* Remote badge */}
            {job.remote && (
              <Badge variant="outline" className="text-slate-600 border-slate-300">
                Remote
              </Badge>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400">{postedDate}</span>
          <span className="text-xs text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
            View details
          </span>
        </div>
      </Card>

      <JobDetailModal job={job} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
