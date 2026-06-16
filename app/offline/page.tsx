import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funnel Offline',
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-6 text-center">
      <h1 className="text-4xl font-light tracking-tight mb-4">Funnel Offline</h1>
      <p className="text-neutral-400 max-w-md leading-relaxed">
        This funnel is currently unavailable. If you are the owner, please check
        your subscription status in your dashboard.
      </p>
    </main>
  )
}
