'use client'

import { useState } from 'react'

export default function DepositForm({ tenantId }: { tenantId: string }) {
  const [ref, setRef] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!ref.trim()) return
    setLoading(true)
    await fetch('/api/deposits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, referenceCode: ref.trim() }),
    })
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
        <strong>Reference submitted!</strong> Our team will confirm your payment within 24 hours and activate your trial.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-neutral-200 p-5">
      <p className="text-sm font-medium mb-3">Submit Payment Reference</p>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black font-mono"
          placeholder="e.g. 1234567890123"
          value={ref}
          onChange={e => setRef(e.target.value)}
        />
        <button
          onClick={submit}
          disabled={loading || !ref.trim()}
          className="bg-black text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      <p className="text-xs text-neutral-400 mt-2">
        Enter the 13-digit GCash reference number from your payment receipt.
      </p>
    </div>
  )
}
