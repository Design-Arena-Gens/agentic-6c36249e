import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Table({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('relative w-full overflow-auto rounded-md border', className)}>
      <table className="w-full caption-bottom text-sm">{children}</table>
    </div>
  )
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="[&_th]:h-10 [&_th]:px-4 [&_th]:text-left [&_th]:align-middle [&_th]:font-medium [&_th]:text-gray-600 bg-gray-50">
      {children}
    </thead>
  )
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="[&_td]:p-4">{children}</tbody>
}

export function TR({ children }: { children: ReactNode }) {
  return <tr className="border-t hover:bg-gray-50">{children}</tr>
}

export function TH({ children }: { children?: ReactNode }) {
  return <th>{children}</th>
}

export function TD({ children }: { children?: ReactNode }) {
  return <td>{children}</td>
}
