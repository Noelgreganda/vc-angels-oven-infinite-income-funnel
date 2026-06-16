import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const LeadSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email(),
  phone: z.string().max(30).optional(),
})

export async function POST(request: NextRequest) {
  const tenantId = request.headers.get('x-tenant-id')
  const funnelSlug = request.headers.get('x-funnel-slug') ?? null

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenant context' }, { status: 400 })
  }

  const body = await request.json().catch(() => null)
  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const supabase = createAdminClient()

  // Resolve funnel id if slug provided (best-effort)
  let funnelId: string | null = null
  if (funnelSlug) {
    const { data } = await supabase
      .from('funnels')
      .select('id')
      .eq('slug', funnelSlug)
      .eq('tenant_id', tenantId)
      .maybeSingle()
    funnelId = data?.id ?? null
  }

  const { error } = await supabase.from('leads').insert({
    tenant_id: tenantId,
    funnel_id: funnelId,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    source: 'apply-form',
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
