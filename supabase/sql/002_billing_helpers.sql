-- Billing helper function used by webhook service role.
create or replace function public.apply_subscription_update(
  p_user_id uuid,
  p_plan_tier text,
  p_subscription_status text,
  p_stripe_customer_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    plan_tier = case when p_plan_tier in ('free', 'pro') then p_plan_tier else 'free' end,
    stripe_subscription_status = p_subscription_status,
    stripe_customer_id = p_stripe_customer_id,
    updated_at = timezone('utc', now())
  where id = p_user_id;
end;
$$;
