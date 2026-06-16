import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TenantDashboardPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: slug } = await params
  const supabase = await createClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name, business_name, status, subscription_active, deposit_status, trial_ends_at, created_at')
    .eq('slug', slug)
    .maybeSingle()

  if (!tenant) notFound()

  const [{ count: leadCount }, { count: funnelCount }, { data: recentLeads }] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id),
    supabase.from('funnels').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id).eq('published', true),
    supabase.from('leads').select('name, email, created_at').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(5),
  ])

  const trialEnds = tenant.trial_ends_at ? new Date(tenant.trial_ends_at) : null
  const daysLeft = trialEnds ? Math.max(0, Math.ceil((trialEnds.getTime() - Date.now()) / 86400000)) : null

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">
        {tenant.business_name ?? tenant.name}
      </h1>
      <p className="text-sm text-neutral-500 mb-8">Tenant Dashboard</p>

      {/* Trial / Deposit Banner */}
      {tenant.deposit_status === 'pending' && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 flex items-center justify-between">
          <span>
            <strong>₱1,000 deposit pending.</strong> Confirm payment to activate your 30-day trial.
          </span>
          <Link href={`/${slug}/dashboard/deposit`} className="ml-4 underline font-medium">
            Pay now →
          </Link>
        </div>
      )}

      {daysLeft !== null && tenant.deposit_status === 'confirmed' && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
          <strong>{daysLeft} days</strong> remaining in your free trial.
          AI agents are targeting ₱20,000 in sales within your first 7 days.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: leadCount ?? 0 },
          { label: 'Live Funnels', value: funnelCount ?? 0 },
          { label: 'Trial Status', value: tenant.deposit_status === 'confirmed' ? 'Active' : 'Pending' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-neutral-200 px-5 py-4">
            <p className="text-xs text-neutral-500 mb-1">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Guarantee Banner */}
      <div className="mb-8 rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-sm text-green-800">
        <strong>30-Day Guarantee:</strong> If your funnel does not generate at least ₱20,000 in sales
        within 30 days, we refund your full ₱1,000 deposit — no questions asked.
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { href: `/${slug}/dashboard/funnel`, label: 'Build Your Funnel', desc: 'AI-powered landing page generator' },
          { href: `/${slug}/dashboard/copy`, label: 'Generate Copy', desc: 'Headlines, emails, ads — AI-written' },
          { href: `/${slug}/dashboard/leads`, label: 'View Leads', desc: `${leadCount ?? 0} captured so far` },
          { href: `/${slug}/onboarding`, label: 'Onboarding Interview', desc: 'Let AI set up your funnel strategy' },
        ].map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-neutral-200 px-5 py-4 hover:bg-neutral-50 transition-colors"
          >
            <p className="font-medium text-sm mb-1">{label}</p>
            <p className="text-xs text-neutral-500">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Leads */}
      {recentLeads && recentLeads.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Recent Leads</h2>
          <div className="rounded-xl border border-neutral-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="px-4 py-2">{lead.name ?? '—'}</td>
                    <td className="px-4 py-2 text-neutral-500">{lead.email ?? '—'}</td>
                    <td className="px-4 py-2 text-neutral-400 text-xs">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
