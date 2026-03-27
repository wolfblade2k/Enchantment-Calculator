import * as React from 'react'
import { cn } from '@/lib/utils'

type TabsContextType = {
  value: string
  setValue: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | null>(null)

export function Tabs({
  defaultValue,
  className,
  children,
}: React.PropsWithChildren<{ defaultValue: string; className?: string }>) {
  const [value, setValue] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex gap-1', className)} {...props} />
}

export function TabsTrigger({
  value,
  className,
  children,
}: React.PropsWithChildren<{ value: string; className?: string }>) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) return null
  const active = ctx.value === value
  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={cn(
        'px-3 py-2 text-sm rounded-md',
        active ? 'bg-slate-200 text-slate-900' : 'bg-transparent text-slate-100',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  className,
  children,
}: React.PropsWithChildren<{ value: string; className?: string }>) {
  const ctx = React.useContext(TabsContext)
  if (!ctx || ctx.value !== value) return null
  return <div className={cn(className)}>{children}</div>
}
