'use client'

import { Job } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, MapPin, Briefcase, DollarSign, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface JobDetailModalProps {
  job: Job
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return 'Salary not disclosed'

  const formatK = (n: number) => {
    if (n >= 1000) return `$${Math.round(n / 1000)}k`
    return `$${n}`
  }

  if (min && max) return `${formatK(min)} – ${formatK(max)}`
  if (min) return `${formatK(min)}+`
  if (max) return `Up to ${formatK(max)}`
  return 'Salary not disclosed'
}

function formatExperienceLevel(level: string | null): string {
  if (!level) return ''
  const labels: Record<string, string> = {
    ENTRY: 'Entry Level',
    MID: 'Mid Level',
    SENIOR: 'Senior',
    EXECUTIVE: 'Executive',
  }
  return labels[level] || level
}

export function JobDetailModal({ job, open, onOpenChange }: JobDetailModalProps) {
  const postedDate = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })
  const salary = formatSalary(job.salaryMin, job.salaryMax)
  const experienceLabel = formatExperienceLevel(job.experienceLevel)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Badges */}
          {(job.isRjrpVerified || job.remote) && (
            <div className="flex flex-wrap items-center gap-2">
              {job.isRjrpVerified && (
                <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200 gap-1">
                  <CheckCircle className="h-3 w-3" />
                  RJRP Verified
                </Badge>
              )}
              {job.remote && (
                <Badge variant="outline" className="text-slate-600 border-slate-300">
                  Remote
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <DialogTitle>{job.title}</DialogTitle>

          {/* Metadata */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-600">
            <span className="font-medium text-slate-700">{job.company}</span>
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {job.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-slate-400" />
              {salary}
            </span>
            {experienceLabel && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                {experienceLabel}
              </span>
            )}
            <span className="text-slate-400">{postedDate}</span>
          </div>
        </DialogHeader>

        {/* Description */}
        <div className="border-t border-slate-100 pt-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {job.description || 'No description provided.'}
        </div>

        {/* Apply button */}
        <div className="border-t border-slate-100 pt-4">
          {job.applyUrl ? (
            <Button
              asChild
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            >
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                Apply Now <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <p className="text-sm text-slate-400">No application link available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
