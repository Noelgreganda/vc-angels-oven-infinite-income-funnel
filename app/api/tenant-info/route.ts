import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const supabase = await createClient()
  const { data } = await supabase
    .from('tenants')
    .select('id, name, business_name, deposit_status')
    .eq('slug', slug)
    .maybeSingle()

  return NextResponse.json(data ?? {})
}
