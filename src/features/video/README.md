# video

Status: not built

Google Meet link generation, attached to a Calendar event via `conferenceData` when a booking is confirmed. No standalone video call UI — links open in Google Meet.

- `server/` — wraps `src/lib/google` calendar client to create the event + Meet link and store it on the booking

Depends on: `src/lib/google` (Calendar API client, OAuth credentials pending).
