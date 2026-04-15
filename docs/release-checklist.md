# SaaS Release Checklist

- [ ] Confirm `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `app.json`.
- [ ] Confirm `EXPO_PUBLIC_BILLING_API_URL` in `app.json`.
- [ ] Apply `supabase/sql/001_saas_schema.sql`.
- [ ] Apply `supabase/sql/002_billing_helpers.sql`.
- [ ] Validate RLS policies using two test users.
- [ ] Deploy `backend/billing-api` with Stripe secrets.
- [ ] Configure Stripe webhook endpoint `/billing/webhook`.
- [ ] Verify upgrade to `pro` and downgrade back to `free`.
- [ ] Verify offline create/edit and sync on reconnect.
- [ ] Run `npm run lint`.
- [ ] Run QA on Android physical device notifications.
