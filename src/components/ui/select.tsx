import * as React from 'react'
import { cn } from '@/lib/utils'

type SelectContextType = {
  value: string
  onValueChange: (value: string) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

export function Select({
  value,
  onValueChange,
  children,
}: React.PropsWithChildren<{ value: string; onValueChange: (value: string) => void }>) {
  return <SelectContext.Provider value={{ value, onValueChange }}>{children}</SelectContext.Provider>
}

export function SelectTrigger({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn(className)}>{children}</div>
}

export function SelectValue() {
  const ctx = React.useContext(SelectContext)
  return <span>{ctx?.value}</span>
}

export function SelectContent({ children }: React.PropsWithChildren) {
  return <div className="mt-1 flex flex-col gap-1">{children}</div>
}

export function SelectItem({ value, children }: React.PropsWithChildren<{ value: string }>) {
  const ctx = React.useContext(SelectContext)
  if (!ctx) return null
  return (
    <button
      type="button"
      onClick={() => ctx.onValueChange(value)}
      className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm text-slate-100 hover:bg-slate-800"
    >
      {children}
    </button>
  )
}
