# Setup Guide

This guide explains how to run Project HERMES locally for development or demo preparation.

## Prerequisites

You will need:

- Node.js 20 or newer
- `pnpm`
- Docker Desktop or another local Docker runtime
- Supabase CLI
- `ngrok` or a similar tunnel tool if you want to test Telegram webhooks from a local machine

## 1. Install dependencies

```bash
pnpm install
```

## 2. Start the local database stack

Start the local Supabase services:

```bash
supabase start
```

Then apply migrations and seed data:

```bash
supabase db reset
```

This gives you a clean local database with the schema and seed content used by the app.

## 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with the correct values for your machine and test credentials.

### Required local values

- `NEXT_PUBLIC_SUPABASE_URL`
  Local Supabase URL from the Supabase CLI output

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  Local publishable key from the Supabase CLI output

- `SUPABASE_SERVICE_ROLE_KEY`
  Local service role key from the Supabase CLI output

- `DATABASE_URL`
  Local PostgreSQL connection string

- `NEXT_PUBLIC_SITE_URL`
  Usually `http://127.0.0.1:3000` or `http://localhost:3000`

### AI service keys

- `GOOGLE_GENERATIVE_AI_API_KEY`
  Required for AI-assisted incident parsing

- `DEEPGRAM_API_KEY`
  Required if you want to test audio input or transcription flows

### Optional messaging channel variables

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET_TOKEN`
- `TELEGRAM_BOT_USERNAME`
- `FACEBOOK_APP_SECRET`
- `FACEBOOK_PAGE_ACCESS_TOKEN`
- `FACEBOOK_VERIFY_TOKEN`

### Optional geocoding values

- `NOMINATIM_BASE_URL`
- `NOMINATIM_EMAIL`
- `NOMINATIM_USER_AGENT`

## 4. Run the app

```bash
pnpm dev
```

Open `http://localhost:3000`.

## 5. Create the first admin account

When the project is running for the first time, create the bootstrap admin account through:

```text
/auth/sign-up
```

After the first admin account exists, new staff accounts are expected to go through the invite flow instead of open registration.

## 6. Optional Telegram webhook setup

If you want to test Telegram locally, expose your Next.js app with a public tunnel:

```bash
ngrok http 3000
```

Then register the webhook with Telegram:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://<your-subdomain>.ngrok-free.dev/api/webhooks/telegram",
    "secret_token": "<your-webhook-secret-token>"
  }'
```

Use the same secret value you placed in `TELEGRAM_WEBHOOK_SECRET_TOKEN`.

## 7. Optional Messenger setup

Messenger support is available, but it requires a configured Meta app, page access token, and webhook setup. The app expects the Facebook-related environment variables from `.env.example`.

## Recommended validation commands

Before opening a pull request or preparing a demo build, run:

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Troubleshooting

- If Supabase credentials do not match your local stack, restart with `supabase start` and recheck the generated values.
- If your local schema or seed data is out of date, run `supabase db reset`.
- If Telegram messages are not reaching your app, verify that your tunnel URL is still active and that the webhook secret matches.
