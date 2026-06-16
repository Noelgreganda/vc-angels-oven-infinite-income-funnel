'use client'

import { useState } from 'react'

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const body = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
    }
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-light mb-4">You&apos;re in.</h1>
          <p className="text-neutral-400">
            We&apos;ll be in touch shortly with your GCash payment link for the ₱1,000 refundable deposit.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-3xl font-light mb-2">Apply Now</h1>
        <p className="text-sm text-neutral-400 mb-4">
          Free 30-day trial · ₱1,000 refundable deposit
        </p>
        <input
          name="name"
          required
          placeholder="Full name"
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email address"
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone (optional)"
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-white text-black font-medium py-3 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Submit Application'}
        </button>
      </form>
    </main>
  )
}
