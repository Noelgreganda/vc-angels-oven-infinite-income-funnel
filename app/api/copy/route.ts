import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const COPY_SYSTEM = `You are an elite Filipino direct-response copywriter. You write high-converting sales copy for online entrepreneurs in the Philippines.

Your copy must:
- Speak directly to the target audience's deepest pain points
- Use proven direct-response formulas (AIDA, PAS, etc.)
- Include social proof cues and urgency
- Be written in a mix of Filipino-English (Taglish) when appropriate for relatability
- Always emphasize the ₱20,000 guarantee and results within 7 days

When asked for full_funnel copy, respond in this EXACT JSON format:
{
  "headline": "...",
  "subheadline": "...",
  "cta_text": "...",
  "body_copy": "..."
}

For other types, respond with just the copy text.`

export async function POST(req: NextRequest) {
  const { tenantId, funnelId, type, context } = await req.json()

  const prompt = type === 'full_funnel'
    ? `Generate complete funnel copy. Context: ${context}. Return JSON only.`
    : `Write ${type} copy for: ${context}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: COPY_SYSTEM,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  // Log to copy_jobs
  const supabase = await createClient()
  await supabase.from('copy_jobs').insert({
    tenant_id: tenantId,
    funnel_id: funnelId ?? null,
    type,
    prompt,
    result: text,
    status: 'done',
  })

  if (type === 'full_funnel') {
    try {
      return NextResponse.json(JSON.parse(text))
    } catch {
      return NextResponse.json({ text })
    }
  }

  return NextResponse.json({ text })
}
