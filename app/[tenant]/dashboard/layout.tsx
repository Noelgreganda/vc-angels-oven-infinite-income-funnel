'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useParams } from 'next/navigation'

const navItems = [
  { href: 'dashboard', label: 'Overview' },
  { href: 'dashboard/funnel', label: 'Funnel Builder' },
  { href: 'dashboard/leads', label: 'Lead CRM' },
  { href: 'dashboard/copy', label: 'AI Copywriting' },
  { href: 'dashboard/deposit', label: 'Deposit & Billing' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const params = useParams<{ tenant: string }>()
  const base = `/${params.tenant}`

  return (
    <div className="flex min-h-screen bg-white text-black">
      <aside className="w-56 shrink-0 border-r border-neutral-200 px-4 py-8 flex flex-col gap-1">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-6 px-2">
          Infinite Income
        </p>
        {navItems.map(({ href, label }) => {
          const fullHref = `${base}/${href}`
          const active = pathname === fullHref || pathname.startsWith(fullHref + '/')
          return (
            <Link
              key={href}
              href={fullHref}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                active ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
