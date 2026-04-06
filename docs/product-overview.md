# Product Overview

This document is the fastest way to understand what Project HERMES is trying to do and how the application is organized.

## What HERMES is

Project HERMES is a DRRM communication control center. It is built for situations where residents need to report incidents quickly and responders need a clear operational picture without manually consolidating messages from many channels.

The project combines reporting, triage, visualization, communication, and administration in one system.

## The problem it addresses

Traditional reporting flows often assume that people in distress can fill out clean forms with complete details. In practice, that is rarely true. People send short chat messages, partial locations, photos, or voice notes. Responders then lose time interpreting those messages and turning them into actionable records.

HERMES is designed to shorten that gap between raw communication and coordinated response.

## Who uses the system

- Residents report incidents, receive advisories, and stay connected through familiar channels.
- Responders monitor, verify, classify, and act on incoming reports from the control center.
- Admins manage access, invite staff, and maintain the operational environment.

## End-to-end workflow

1. A resident sends a report through Telegram, Messenger, or a web-based flow.
2. The system interprets the incoming message and turns it into a structured incident record.
3. Responders review the report in the control center dashboard, incident views, and map.
4. The team can update the incident state, coordinate follow-up, and send advisories to affected residents.
5. Operations staff can export records and manage access for responders and administrators.

## Main app areas

- `/`
  The public landing page that explains the project and its core value proposition.

- `/control-center`
  The responder dashboard. This is the main operational entry point after login.

- `/control-center/incidents`
  The incident workspace for reviewing and organizing reported incidents.

- `/control-center/map`
  A geographic view of incidents for situational awareness and area-based operations.

- `/control-center/advisories`
  The advisory workspace for sending public-facing updates and targeted notifications.

- `/control-center/residents`
  The resident directory used to review resident records and operational context.

- `/control-center/export`
  Export tools for incident records and reporting.

- `/control-center/admin-panel`
  Staff provisioning, invite management, and administrative control.

- `/control-center/settings`
  User-level account and appearance settings.

## What makes the project notable

- It accepts free-form incident reports rather than depending only on structured forms.
- It uses channels that people are already comfortable with, rather than requiring a dedicated emergency reporting workflow from the start.
- It is not only a chatbot. The project also includes a responder-facing control center, map interface, export tools, and administrative workflows.
- It supports operational communication, not just intake. Advisories and targeting matter because response is not finished once a report is received.

## Technical design at a glance

- Next.js App Router provides the application shell and route structure.
- Supabase handles authentication, database access, and realtime features.
- AI services support parsing and media-assisted incident interpretation.
- Chat adapters connect the system to Telegram and Messenger.
- Map components support visual incident monitoring and geographic targeting.

## What a judge should look for

- Whether the system reduces friction for residents during reporting
- Whether the responder workflow feels operational rather than purely academic
- Whether the application demonstrates an end-to-end loop from intake to action
- Whether the project balances AI assistance with human review and control

## Suggested demo path

1. Start at `/` to understand the framing of the project.
2. Sign in and open `/control-center` for the dashboard.
3. Move to `/control-center/incidents` and `/control-center/map` to show operational monitoring.
4. Open `/control-center/advisories` to show outbound communication.
5. End with `/control-center/export` and `/control-center/admin-panel` to show governance and operational maturity.
