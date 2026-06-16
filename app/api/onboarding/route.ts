import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const SYSTEM = `You are an expert funnel strategist and onboarding specialist for Infinite Income Funnel — a platform that helps Filipino entrepreneurs build AI-powered sales funnels.

Your job is to conduct a friendly, focused onboarding interview to gather what you need to generate a high-converting sales funnel. Ask one question at a time. Be warm but efficient.

After collecting: business name, niche/product, target audience, main pain point, desired outcome, and price point — output a JSON block ONLY (no other text) in this exact format:
{
  "complete": true,
  "summary": {
    "business_name": "...",
    "niche": "...",
    "target_audience": "...",
    "pain_point": "...",
    "desired_outcome": "...",
    "price_point": "...",
    "headline": "...",
    "subheadline": "...",
    "cta_text": "...",
    "body_copy": "..."
  }
}

Until you have all fields, respond conversationally with the next question. Keep responses under 3 sentences.`

export async function POST(req: NextRequest) {
  const { messages, tenantSlug } = await req.json()

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM,
    messages,
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  // Check if interview is complete
  try {
    const parsed = JSON.parse(text)
    if (parsed.complete && tenantSlug) {
      const supabase = await createClient()
      const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', tenantSlug)
        .maybeSingle()

      if (tenant) {
        await supabase.from('tenants').update({
          business_name: parsed.summary.business_name,
          business_niche: parsed.summary.niche,
          target_audience: parsed.summary.target_audience,
        }).eq('id', tenant.id)

        // Create a draft funnel
        const funnelSlug = parsed.summary.business_name
          .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

        await supabase.from('funnels').upsert({
          tenant_id: tenant.id,
          name: parsed.summary.business_name,
          slug: funnelSlug,
          headline: parsed.summary.headline,
          subheadline: parsed.summary.subheadline,
          cta_text: parsed.summary.cta_text,
          body_copy: parsed.summary.body_copy,
          config: parsed.summary,
          published: false,
        }, { onConflict: 'tenant_id,slug' })
      }
    }
  } catch {
    // Not JSON — still in interview
  }

  return NextResponse.json({ text })
}
