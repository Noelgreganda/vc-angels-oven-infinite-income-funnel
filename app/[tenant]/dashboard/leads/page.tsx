import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function LeadCRMPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: slug } = await params
  const supabase = await createClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (!tenant) notFound()

  const { data: leads } = await supabase
    .from('leads')
    .select('id, name, email, phone, source, created_at, funnels(name)')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Lead CRM</h1>
      <p className="text-sm text-neutral-500 mb-8">All leads captured across your funnels.</p>

      {!leads || leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-400">No leads yet. Publish your funnel to start capturing leads.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                {['Name', 'Email', 'Phone', 'Source', 'Funnel', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={lead.id} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                  <td className="px-4 py-3 font-medium">{lead.name ?? '—'}</td>
                  <td className="px-4 py-3 text-neutral-500">{lead.email ?? '—'}</td>
                  <td className="px-4 py-3 text-neutral-500">{lead.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">{lead.source ?? '—'}</td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">
                    {(Array.isArray(lead.funnels) ? (lead.funnels[0] as { name: string } | undefined)?.name : (lead.funnels as { name: string } | null)?.name) ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
