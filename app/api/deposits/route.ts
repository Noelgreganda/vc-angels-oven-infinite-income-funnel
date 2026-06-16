import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { tenantId, referenceCode } = await req.json()
  if (!tenantId) return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })

  const supabase = await createClient()
  const { error } = await supabase.from('deposits').insert({
    tenant_id: tenantId,
    amount_php: 1000,
    status: 'pending',
    reference_code: referenceCode ?? null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
