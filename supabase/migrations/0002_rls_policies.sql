-- Service role bypass policies for all parent tables
-- Allows full server-side access while blocking anon/public.

drop policy if exists "service_role_all_child_apps" on child_apps;
create policy "service_role_all_child_apps"
  on child_apps for all to service_role
  using (true) with check (true);

drop policy if exists "service_role_all_investors" on investors;
create policy "service_role_all_investors"
  on investors for all to service_role
  using (true) with check (true);

drop policy if exists "service_role_all_agent_activity" on agent_activity;
create policy "service_role_all_agent_activity"
  on agent_activity for all to service_role
  using (true) with check (true);

drop policy if exists "service_role_all_token_usage" on token_usage;
create policy "service_role_all_token_usage"
  on token_usage for all to service_role
  using (true) with check (true);
