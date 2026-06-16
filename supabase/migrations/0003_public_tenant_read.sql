-- Allow public (anon) to read active tenants for proxy/funnel page lookups.
-- Only exposes slug, name, status, subscription_active — no PII.
create policy tenants_public_read on tenants for select
  to anon
  using (subscription_active = true and status not in ('suspended', 'cancelled'));

-- Allow public to read published funnels for active tenants.
create policy funnels_public_read on funnels for select
  to anon
  using (
    published = true
    and exists (
      select 1 from tenants t
      where t.id = funnels.tenant_id
      and t.subscription_active = true
      and t.status not in ('suspended', 'cancelled')
    )
  );
