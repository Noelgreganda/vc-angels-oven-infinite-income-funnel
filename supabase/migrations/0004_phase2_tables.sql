-- Onboarding interview sessions
create table if not exists onboarding_sessions (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid references tenants(id) on delete cascade,
  step        integer not null default 0,
  answers     jsonb not null default '{}',
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table onboarding_sessions enable row level security;
create policy onboarding_tenant_all on onboarding_sessions for all
  using (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid)
  with check (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);
create policy onboarding_service_role on onboarding_sessions for all to service_role
  using (true) with check (true);

-- AI copy generation jobs
create table if not exists copy_jobs (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  funnel_id   uuid references funnels(id) on delete set null,
  type        text not null check (type in ('headline','body','cta','email','ad','full_funnel')),
  prompt      text,
  result      text,
  status      text not null default 'pending' check (status in ('pending','running','done','error')),
  created_at  timestamptz not null default now()
);
alter table copy_jobs enable row level security;
create policy copy_jobs_tenant_all on copy_jobs for all
  using (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid)
  with check (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);
create policy copy_jobs_service_role on copy_jobs for all to service_role
  using (true) with check (true);

-- Deposits (manual GCash / QRPh)
create table if not exists deposits (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenants(id) on delete cascade,
  amount_php      numeric not null default 1000,
  status          text not null default 'pending' check (status in ('pending','confirmed','refunded')),
  reference_code  text,
  notes           text,
  confirmed_at    timestamptz,
  created_at      timestamptz not null default now()
);
alter table deposits enable row level security;
create policy deposits_tenant_select on deposits for select
  using (tenant_id = (auth.jwt()->'app_metadata'->>'tenant_id')::uuid);
create policy deposits_service_role on deposits for all to service_role
  using (true) with check (true);

-- Add missing columns to funnels for builder
alter table funnels add column if not exists headline text;
alter table funnels add column if not exists subheadline text;
alter table funnels add column if not exists cta_text text default 'Apply Now';
alter table funnels add column if not exists body_copy text;
alter table funnels add column if not exists guarantee_text text;

-- Add deposit_status + trial_ends_at to tenants
alter table tenants add column if not exists deposit_status text default 'pending' check (deposit_status in ('pending','paid','refunded'));
alter table tenants add column if not exists trial_ends_at timestamptz;
alter table tenants add column if not exists business_name text;
alter table tenants add column if not exists business_niche text;
alter table tenants add column if not exists target_audience text;
alter table tenants add column if not exists email text;
