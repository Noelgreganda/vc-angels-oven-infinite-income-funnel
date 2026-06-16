'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Message = { role: 'user' | 'assistant'; content: string }

export default function OnboardingPage() {
  const { tenant } = useParams<{ tenant: string }>()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Welcome to Infinite Income Funnel! I'm your AI strategist. I'll ask you a few quick questions to build your personalized sales funnel. Let's start — what's the name of your business or product?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function send() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next, tenantSlug: tenant }),
    })
    const { text } = await res.json()

    try {
      const parsed = JSON.parse(text)
      if (parsed.complete) {
        setDone(true)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Your funnel strategy is ready! I've generated your headline, copy, and funnel structure for "${parsed.summary.business_name}". Redirecting you to the Funnel Builder...`,
        }])
        setTimeout(() => router.push(`/${tenant}/dashboard/funnel`), 2500)
        setLoading(false)
        return
      }
    } catch { /* still in interview */ }

    setMessages(prev => [...prev, { role: 'assistant', content: text }])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Onboarding Interview</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Our AI strategist will set up your funnel in minutes.
        </p>

        <div className="rounded-xl border border-neutral-200 p-4 mb-4 h-96 overflow-y-auto flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-black text-white rounded-br-sm'
                  : 'bg-neutral-100 text-black rounded-bl-sm'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-neutral-400">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {!done && (
          <div className="flex gap-2">
            <input
              className="flex-1 border border-neutral-200 rounded-full px-4 py-2 text-sm outline-none focus:border-black"
              placeholder="Your answer..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-black text-white rounded-full px-5 py-2 text-sm font-medium disabled:opacity-40"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
