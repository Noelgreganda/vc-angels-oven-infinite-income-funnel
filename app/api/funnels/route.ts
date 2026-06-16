import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, tenantId, ...fields } = body

  if (!id || !tenantId) return NextResponse.json({ error: 'Missing id or tenantId' }, { status: 400 })

  const supabase = await createClient()
  const allowed = ['headline', 'subheadline', 'cta_text', 'body_copy', 'published', 'config', 'name']
  const update = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)))

  const { error } = await supabase
    .from('funnels')
    .update(update)
    .eq('id', id)
    .eq('tenant_id', tenantId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
