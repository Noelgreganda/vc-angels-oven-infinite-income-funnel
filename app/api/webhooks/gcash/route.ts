import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHmac, timingSafeEqual } from 'crypto'

// GCash MVP webhook payload (manual confirmation mode)
const GCashWebhookSchema = z.object({
  event: z.string(),
  merchant_id: z.string(),
  reference_number: z.string(),
  status: z.enum(['SUCCESS', 'FAILED', 'PENDING']),
  amount: z.number(),
  currency: z.string().default('PHP'),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

function verifySignature(body: string, signature: string | null): boolean {
  const secret = process.env.GCASH_WEBHOOK_SECRET
  if (!secret || !signature) return false
  const expected = createHmac('sha256', secret).update(body).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-gcash-signature')

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = GCashWebhookSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { event, reference_number, status, amount, currency, metadata } = parsed.data

  if (event === 'PAYMENT' && status === 'SUCCESS') {
    const supabase = createAdminClient()

    // Record the payment against the lead (matched by reference_number stored in metadata)
    const leadId = (metadata as { lead_id?: string } | undefined)?.lead_id ?? null
    if (leadId) {
      await supabase
        .from('leads')
        .update({
          metadata: {
            gcash_reference: reference_number,
            gcash_amount: amount,
            gcash_currency: currency,
            gcash_status: status,
            paid_at: new Date().toISOString(),
          },
          source: 'gcash-paid',
        })
        .eq('id', leadId)
    }

    // Activate tenant subscription (lead_id doubles as tenant identifier in MVP)
    const tenantId = (metadata as { tenant_id?: string } | undefined)?.tenant_id ?? null
    if (tenantId) {
      await supabase
        .from('tenants')
        .update({ subscription_active: true, status: 'active' })
        .eq('id', tenantId)
    }
  }

  return NextResponse.json({ received: true })
}
