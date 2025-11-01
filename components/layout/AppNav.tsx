"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/clients', label: 'Clients' },
  { href: '/projects', label: 'Projects' },
  { href: '/sows', label: 'SOWs' },
  { href: '/crs', label: 'Change Requests' },
  { href: '/invoices', label: 'Invoicing' },
  { href: '/reminders', label: 'Reminders' },
]

export function AppNav() {
  const pathname = usePathname()
  return (
    <header className="border-b bg-white">
      <div className="container flex h-14 items-center justify-between">
        <div className="font-semibold">RCPS</div>
        <nav className="flex items-center gap-4 text-sm">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
