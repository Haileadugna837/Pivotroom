# booking

Status: not built

Session booking flow: expert availability (synced from Google Calendar), slot selection, booking creation, cancellation/reschedule.

- `components/` — availability calendar picker, booking confirmation UI
- `server/` — availability computation, booking CRUD, conflict checks

Depends on: `src/lib/google` (Calendar API client), Supabase schema (`bookings`, `availability` tables) — not yet created.
