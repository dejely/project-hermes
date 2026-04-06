# Project HERMES

Project HERMES is a Disaster Risk Reduction and Management communication control center. It is designed to make incident reporting easier for residents and to give responders one place to monitor reports, verify information, coordinate action, and send advisories.

Instead of forcing people to fill out rigid forms during stressful situations, HERMES accepts reports through familiar channels such as chat and converts them into structured incident records that responders can work with immediately.

## Why this project matters

Emergency communication often breaks down at the exact moment clarity matters most. Residents may only be able to send a short message, a photo, a voice note, or a location pin. Responders, meanwhile, need a single operational view instead of scattered messages across multiple channels.

HERMES addresses that gap by combining:

- multi-channel incident intake
- AI-assisted structuring of free-form reports
- a responder-facing control center with dashboard, incident board, and map
- advisory broadcasting and geographic targeting
- exports, health checks, and administrative controls for operational use

## How the app works

1. A resident reports an incident through a familiar channel such as Telegram, Messenger, or the web app.
2. HERMES processes the message and extracts usable incident details such as type, severity, time, description, and location.
3. Responders review the incoming report in the control center, where incidents can be monitored as cards, tables, and mapped events.
4. The operations team can verify details, coordinate follow-up, send advisories, and target residents by area.
5. Incident data can be exported for reporting, audit, and after-action review.

## What to explore first

If you are evaluating the project, start with the product story before reading the setup instructions:

- [Product Overview](docs/product-overview.md) explains the users, workflow, main app areas, and architecture at a high level.
- [Setup Guide](docs/setup.md) explains how to run the project locally.

The main app areas are:

- `/` for the public landing page and project positioning
- `/control-center` for the responder dashboard
- `/control-center/incidents` for incident management
- `/control-center/map` for geographic situational awareness
- `/control-center/advisories` for broadcasts and area-based alerts
- `/control-center/residents` for the resident directory
- `/control-center/export` for incident exports
- `/control-center/admin-panel` for staff and access management

## Product highlights

- AI-assisted incident reporting that accepts natural language instead of relying only on structured forms
- support for chat-based reporting through Telegram and Messenger
- a unified control center for dashboard monitoring, incident review, and geographic visualization
- resident targeting for advisories using polygon-based selection
- role-based access with bootstrap admin creation and invite-based account setup
- export flows for operational reporting
- health and readiness endpoints for deployment monitoring

## Technical overview

Project HERMES is built with:

- Next.js App Router for the web application
- React and TypeScript for the frontend
- Supabase for authentication, PostgreSQL, and realtime features
- Vercel AI SDK with Google Gemini and Deepgram for AI-assisted parsing and media processing
- Telegram and Messenger adapters for resident-facing communication
- MapLibre and Leaflet-based mapping for incident visualization

## Quick start

1. Install dependencies with `pnpm install`.
2. Start local Supabase with `supabase start`.
3. Apply the local schema and seed data with `supabase db reset`.
4. Copy `.env.example` to `.env.local` and fill in the required values.
5. Start the app with `pnpm dev`.
6. Open `http://localhost:3000`.
7. Create the first admin account through `/auth/sign-up`.

For the full setup, environment variable notes, and optional Telegram webhook flow, see [docs/setup.md](docs/setup.md).

## Documentation

- [Product Overview](docs/product-overview.md)
- [Setup Guide](docs/setup.md)
- [Contributing Guide](CONTRIBUTING.md)

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the expected workflow, checks, and pull request guidelines.

## License

This project is distributed under the [Apache License 2.0](LICENSE).
