import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import DepositForm from './deposit-form'

export const dynamic = 'force-dynamic'

export default async function DepositPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: slug } = await params
  const supabase = await createClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name, deposit_status')
    .eq('slug', slug)
    .maybeSingle()

  if (!tenant) notFound()

  const { data: deposits } = await supabase
    .from('deposits')
    .select('id, amount_php, status, reference_code, confirmed_at, created_at')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Deposit & Billing</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Manual payment via GCash or QRPh. All payments are confirmed by our team within 24 hours.
      </p>

      {tenant.deposit_status === 'confirmed' ? (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
          <strong>Deposit confirmed.</strong> Your 30-day trial is active. AI agents are working on your results.
        </div>
      ) : (
        <>
          {/* Payment Instructions */}
          <div className="rounded-xl border border-neutral-200 p-6 mb-6">
            <h2 className="text-base font-semibold mb-4">How to Pay — ₱1,000 Deposit</h2>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <p className="font-medium">Send ₱1,000 via GCash</p>
                  <p className="text-neutral-500">Send to our GCash merchant link or scan the QRPh code below.</p>
                  <div className="mt-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-mono text-neutral-600">
                    GCash: 0917-XXX-XXXX · Name: VC Angel&apos;s Oven
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <p className="font-medium">Save your reference number</p>
                  <p className="text-neutral-500">GCash will show a 13-digit reference number after payment.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <p className="font-medium">Submit your reference below</p>
                  <p className="text-neutral-500">Enter your reference number and we will confirm within 24 hours.</p>
                </div>
              </div>
            </div>

            {/* QRPh placeholder */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="w-40 h-40 rounded-xl border-2 border-dashed border-neutral-200 flex items-center justify-center">
                <p className="text-xs text-neutral-400 text-center">QRPh Code<br/>Coming Soon</p>
              </div>
              <p className="text-xs text-neutral-400">Scan with any GCash, Maya, or bank app</p>
            </div>
          </div>

          <DepositForm tenantId={tenant.id} />
        </>
      )}

      {/* Deposit history */}
      {deposits && deposits.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-3">Payment History</h2>
          <div className="rounded-xl border border-neutral-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  {['Amount', 'Reference', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-medium text-neutral-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deposits.map((d, i) => (
                  <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="px-4 py-2 font-medium">₱{d.amount_php}</td>
                    <td className="px-4 py-2 text-neutral-500 font-mono text-xs">{d.reference_code ?? '—'}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        d.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        d.status === 'refunded' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-neutral-400 text-xs">
                      {new Date(d.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guarantee */}
      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
        <strong>100% Refundable.</strong> If your funnel does not generate at least ₱20,000 in sales within 30 days, we refund your full ₱1,000 deposit — no questions asked.
      </div>
    </div>
  )
}
