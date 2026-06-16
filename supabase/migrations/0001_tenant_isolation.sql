-- tenants
create table if not exists tenants (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  status              text not null default 'trial'
                        check (status in ('active','suspended','cancelled','trial')),
  subscription_active boolean not null default true,
  created_at          timestamptz not null default now()
);
alter table tenants enable row level security;
create policy tenants_self_read on tenants for select
  using (id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);

-- funnels
create table if not exists funnels (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  name       text not null,
  slug       text not null,
  published  boolean not null default false,
  config     jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, slug)
);
alter table funnels enable row level security;
create policy funnels_select on funnels for select
  using (
    tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid
    and exists (select 1 from tenants t where t.id = funnels.tenant_id and t.subscription_active)
  );
create policy funnels_insert on funnels for insert
  with check (
    tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid
    and exists (select 1 from tenants t where t.id = funnels.tenant_id and t.subscription_active)
  );
create policy funnels_update on funnels for update
  using  (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid)
  with check (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);
create policy funnels_delete on funnels for delete
  using (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);

-- leads
create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  funnel_id  uuid references funnels(id) on delete set null,
  name       text,
  email      text,
  phone      text,
  source     text,
  metadata   jsonb,
  created_at timestamptz not null default now()
);
alter table leads enable row level security;
create policy leads_select on leads for select
  using (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);
create policy leads_insert on leads for insert
  with check (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);
create policy leads_update on leads for update
  using  (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid)
  with check (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);
create policy leads_delete on leads for delete
  using (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);
