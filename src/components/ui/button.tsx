import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'icon'
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' && 'bg-slate-200 text-slate-900 hover:bg-slate-300',
        variant === 'outline' && 'border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800',
        variant === 'ghost' && 'text-slate-100 hover:bg-slate-800',
        variant === 'secondary' && 'bg-slate-800 text-slate-100 hover:bg-slate-700',
        size === 'default' && 'h-10 px-4 py-2',
        size === 'icon' && 'h-10 w-10',
        className,
      )}
      {...props}
    />
  )
}
