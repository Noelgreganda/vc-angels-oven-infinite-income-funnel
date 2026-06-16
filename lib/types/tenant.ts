export type TenantStatus = 'active' | 'suspended' | 'cancelled' | 'trial'

export interface Tenant {
  id: string
  slug: string
  name: string
  status: TenantStatus
  subscription_active: boolean
  created_at: string
}

export interface TenantContext {
  tenantId: string
  tenantSlug: string
  subscriptionActive: boolean
}
