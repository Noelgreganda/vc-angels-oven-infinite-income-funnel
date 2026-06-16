'use client'

import { useState } from 'react'

type Funnel = {
  id: string
  name: string
  slug: string
  published: boolean
  headline: string | null
  subheadline: string | null
  cta_text: string | null
  body_copy: string | null
}

export default function FunnelEditor({
  tenantId,
  tenantSlug,
  funnels: initial,
}: {
  tenantId: string
  tenantSlug: string
  funnels: Funnel[]
}) {
  const [funnels, setFunnels] = useState(initial)
  const [selected, setSelected] = useState<Funnel | null>(initial[0] ?? null)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [msg, setMsg] = useState('')

  async function save() {
    if (!selected) return
    setSaving(true)
    const res = await fetch('/api/funnels', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, tenantId, headline: selected.headline, subheadline: selected.subheadline, cta_text: selected.cta_text, body_copy: selected.body_copy, name: selected.name }),
    })
    setSaving(false)
    setMsg(res.ok ? 'Saved.' : 'Save failed.')
    setTimeout(() => setMsg(''), 2000)
  }

  async function generateCopy() {
    if (!selected) return
    setGenerating(true)
    const res = await fetch('/api/copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId,
        funnelId: selected.id,
        type: 'full_funnel',
        context: `Business: ${selected.name}. Current headline: ${selected.headline ?? 'none'}`,
      }),
    })
    const data = await res.json()
    if (data.headline) {
      setSelected(prev => prev ? { ...prev, ...data } : prev)
    }
    setGenerating(false)
  }

  async function togglePublish() {
    if (!selected) return
    const res = await fetch('/api/funnels', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, tenantId, published: !selected.published }),
    })
    if (res.ok) {
      setSelected(prev => prev ? { ...prev, published: !prev.published } : prev)
      setFunnels(prev => prev.map(f => f.id === selected.id ? { ...f, published: !f.published } : f))
    }
  }

  function field(key: keyof Funnel, label: string, multiline = false) {
    if (!selected) return null
    const val = (selected[key] as string) ?? ''
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSelected(prev => prev ? { ...prev, [key]: e.target.value } : prev)
    return (
      <div key={key}>
        <label className="block text-xs font-medium text-neutral-500 mb-1">{label}</label>
        {multiline ? (
          <textarea
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black resize-none"
            rows={4}
            value={val}
            onChange={onChange}
          />
        ) : (
          <input
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
            value={val}
            onChange={onChange}
          />
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Funnel list */}
      <div className="col-span-1">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Funnels</p>
        <div className="flex flex-col gap-2">
          {funnels.map(f => (
            <button
              key={f.id}
              onClick={() => setSelected(f)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selected?.id === f.id ? 'bg-black text-white' : 'hover:bg-neutral-100'
              }`}
            >
              <span className="block font-medium">{f.name}</span>
              <span className={`text-xs ${selected?.id === f.id ? 'text-neutral-300' : 'text-neutral-400'}`}>
                {f.published ? 'Live' : 'Draft'} · /{f.slug}
              </span>
            </button>
          ))}
          {funnels.length === 0 && (
            <p className="text-xs text-neutral-400">No funnels yet. Complete onboarding to generate your first funnel.</p>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="col-span-2">
        {selected ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${selected.published ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                  {selected.published ? 'Live' : 'Draft'}
                </span>
                <span className="text-xs text-neutral-400">/{tenantSlug}/{selected.slug}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generateCopy}
                  disabled={generating}
                  className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40"
                >
                  {generating ? 'Generating...' : 'AI Generate Copy'}
                </button>
                <button
                  onClick={togglePublish}
                  className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50"
                >
                  {selected.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="text-xs px-3 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 disabled:opacity-40"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            {msg && <p className="text-xs text-green-600">{msg}</p>}
            {field('headline', 'Headline')}
            {field('subheadline', 'Subheadline')}
            {field('cta_text', 'CTA Button Text')}
            {field('body_copy', 'Body Copy', true)}
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-800">
              Guarantee banner: "If your funnel does not generate at least ₱20,000 in sales within 30 days, we refund your full ₱1,000 deposit." <span className="text-green-600">(Always visible on funnel page)</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-neutral-200">
            <p className="text-sm text-neutral-400">Select a funnel to edit</p>
          </div>
        )}
      </div>
    </div>
  )
}
