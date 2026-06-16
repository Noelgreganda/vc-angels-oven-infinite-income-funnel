'use client'

import { useState, useEffect, use } from 'react'

const COPY_TYPES = [
  { value: 'headline', label: 'Headline' },
  { value: 'body', label: 'Body Copy' },
  { value: 'cta', label: 'CTA Text' },
  { value: 'email', label: 'Email Sequence' },
  { value: 'ad', label: 'Ad Copy' },
  { value: 'full_funnel', label: 'Full Funnel Package' },
]

export default function CopywritingPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: slug } = use(params)
  const [type, setType] = useState('headline')
  const [context, setContext] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [tenantId, setTenantId] = useState('')

  useEffect(() => {
    fetch(`/api/tenant-info?slug=${slug}`)
      .then(r => r.json())
      .then(d => setTenantId(d.id ?? ''))
  }, [slug])

  async function generate() {
    if (!context.trim()) return
    setLoading(true)
    setResult('')
    const res = await fetch('/api/copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, type, context }),
    })
    const data = await res.json()
    if (data.headline) {
      setResult(JSON.stringify(data, null, 2))
    } else {
      setResult(data.text ?? '')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">AI Copywriting Department</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Generate high-converting Filipino direct-response copy powered by Claude.
      </p>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Copy Type</label>
          <div className="flex flex-wrap gap-2">
            {COPY_TYPES.map(ct => (
              <button
                key={ct.value}
                onClick={() => setType(ct.value)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  type === ct.value
                    ? 'bg-black text-white border-black'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Context / Brief
          </label>
          <textarea
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black resize-none"
            rows={4}
            placeholder="e.g. I sell online tutoring for high school students in the Philippines. Target: parents aged 35-50 worried about their child's college admission..."
            value={context}
            onChange={e => setContext(e.target.value)}
          />
        </div>

        <button
          onClick={generate}
          disabled={loading || !context.trim()}
          className="self-start bg-black text-white rounded-full px-6 py-2 text-sm font-medium disabled:opacity-40"
        >
          {loading ? 'Generating...' : 'Generate Copy'}
        </button>
      </div>

      {result && (
        <div>
          <p className="text-xs font-medium text-neutral-500 mb-2">Generated Copy</p>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm whitespace-pre-wrap font-mono text-neutral-700">
            {result}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="mt-2 text-xs text-neutral-400 hover:text-black underline"
          >
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  )
}
