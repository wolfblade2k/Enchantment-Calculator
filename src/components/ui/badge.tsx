import * as React from 'react'
import { cn } from '@/lib/utils'

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'outline' | 'secondary' }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
        variant === 'default' && 'bg-slate-200 text-slate-900',
        variant === 'outline' && 'border border-slate-700 text-slate-200',
        variant === 'secondary' && 'bg-slate-800 text-slate-100',
        className,
      )}
      {...props}
    />
  )
}
