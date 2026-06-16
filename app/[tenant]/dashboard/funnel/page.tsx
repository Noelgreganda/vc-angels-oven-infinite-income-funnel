import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import FunnelEditor from './funnel-editor'

export const dynamic = 'force-dynamic'

export default async function FunnelBuilderPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: slug } = await params
  const supabase = await createClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name')
    .eq('slug', slug)
    .maybeSingle()

  if (!tenant) notFound()

  const { data: funnels } = await supabase
    .from('funnels')
    .select('id, name, slug, published, headline, subheadline, cta_text, body_copy')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Funnel Builder</h1>
      <p className="text-sm text-neutral-500 mb-8">Build and publish AI-powered landing pages.</p>
      <FunnelEditor tenantId={tenant.id} tenantSlug={slug} funnels={funnels ?? []} />
    </div>
  )
}
