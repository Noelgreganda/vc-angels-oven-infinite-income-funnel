-- Child Apps / Tenants
CREATE TABLE IF NOT EXISTS child_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  status text DEFAULT 'development',
  revenue_share_percent numeric DEFAULT 20,
  created_at timestamptz DEFAULT now()
);

-- Investors / Partners
CREATE TABLE IF NOT EXISTS investors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  investment_amount numeric,
  equity_percentage numeric,
  notes text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Agent Activity Log
CREATE TABLE IF NOT EXISTS agent_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_role text NOT NULL,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Token Usage (CFO dashboard)
CREATE TABLE IF NOT EXISTS token_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date DEFAULT current_date,
  model text,
  input_tokens bigint,
  output_tokens bigint,
  cached_tokens bigint,
  cost_usd numeric
);

-- RLS
ALTER TABLE child_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;

-- Service role bypass (parent app uses service role key)
CREATE POLICY "service_role_all" ON child_apps FOR ALL USING (true);
CREATE POLICY "service_role_all" ON investors FOR ALL USING (true);
CREATE POLICY "service_role_all" ON agent_activity FOR ALL USING (true);
CREATE POLICY "service_role_all" ON token_usage FOR ALL USING (true);
