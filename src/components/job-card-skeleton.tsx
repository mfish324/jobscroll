import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function JobCardSkeleton() {
  return (
    <Card className="p-6 bg-white border-slate-200">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Company */}
          <Skeleton className="h-4 w-24 mb-2" />

          {/* Title */}
          <Skeleton className="h-6 w-3/4 mb-3" />

          {/* Details row */}
          <div className="flex gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Right side badges */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  )
}
