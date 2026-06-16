import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

type Props = { params: Promise<{ tenant: string; funnel: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant, funnel } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('funnels')
    .select('name, tenants!inner(slug)')
    .eq('slug', funnel)
    .eq('tenants.slug', tenant)
    .eq('published', true)
    .maybeSingle()
  return { title: data?.name ?? 'Funnel' }
}

export default async function FunnelPage({ params }: Props) {
  const { tenant, funnel } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('funnels')
    .select('id, name, headline, subheadline, cta_text, body_copy, config, tenants!inner(slug, name)')
    .eq('slug', funnel)
    .eq('tenants.slug', tenant)
    .eq('published', true)
    .maybeSingle()

  if (!data) notFound()

  const headline = data.headline ?? (data.config as Record<string, string> | null)?.headline ?? data.name
  const subheadline = data.subheadline ?? (data.config as Record<string, string> | null)?.subheadline
  const ctaText = data.cta_text ?? 'Get Started — ₱1,000 Deposit'
  const bodyText = data.body_copy

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6 max-w-2xl mx-auto">
        <h1 className="text-5xl font-semibold tracking-tight">{headline}</h1>

        {subheadline && (
          <p className="text-xl text-gray-500 max-w-xl">{subheadline}</p>
        )}

        {bodyText && (
          <p className="text-base text-gray-600 max-w-lg leading-relaxed">{bodyText}</p>
        )}

        {/* Guarantee banner */}
        <div className="border border-green-200 bg-green-50 rounded-xl px-6 py-4 max-w-lg text-sm text-green-800">
          <strong>30-Day Guarantee:</strong> If your funnel does not generate at least ₱20,000 in sales within 30 days,
          we refund your full ₱1,000 deposit — no questions asked.
        </div>

        <a
          href={`/${tenant}/${funnel}/apply`}
          className="mt-2 inline-block bg-black text-white text-base font-medium px-8 py-4 rounded-full hover:bg-gray-900 transition-colors"
        >
          {ctaText}
        </a>

        <p className="text-xs text-gray-400">
          Free 30-day trial · Fully refundable deposit · AI agents targeting results in 7 days
        </p>
      </section>
    </main>
  )
}
