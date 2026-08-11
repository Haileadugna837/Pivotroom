# lib/google

Status: not built

Google Calendar API client (OAuth2), used by both `features/booking` (availability sync) and `features/video` (Meet link generation via `conferenceData` on calendar events).

Planned files:
- `client.ts` — OAuth2 client factory
- `calendar.ts` — list events (busy/free), create event with Meet link
- `oauth.ts` — per-expert connect/callback flow, token storage

Depends on: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` env vars — not yet provided.
