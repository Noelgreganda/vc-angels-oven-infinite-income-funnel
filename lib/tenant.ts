import { createClient } from '@/lib/supabase/server'
import type { TenantContext } from '@/lib/types/tenant'

export async function getTenantContext(): Promise<TenantContext | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const tenantId =
    (user.app_metadata as { tenant_id?: string })?.tenant_id ??
    (user.user_metadata as { tenant_id?: string })?.tenant_id
  if (!tenantId) return null

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('id, slug, subscription_active')
    .eq('id', tenantId)
    .single()
  if (error || !tenant) return null

  return {
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    subscriptionActive: tenant.subscription_active,
  }
}
