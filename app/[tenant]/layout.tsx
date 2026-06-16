import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant: slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('tenants')
    .select('id, name, subscription_active, status')
    .eq('slug', slug)
    .maybeSingle()

  if (!data || !data.subscription_active || data.status === 'suspended' || data.status === 'cancelled') {
    notFound()
  }

  return <>{children}</>
}
