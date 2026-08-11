import "server-only";
import { google } from "googleapis";
import { createOAuthClientWithRefreshToken } from "./client";

type CreateBookingEventArgs = {
  refreshToken: string;
  summary: string;
  description?: string;
  startTime: string; // ISO
  endTime: string; // ISO
  attendeeEmails: string[];
};

export async function createBookingEventWithMeet({
  refreshToken,
  summary,
  description,
  startTime,
  endTime,
  attendeeEmails,
}: CreateBookingEventArgs) {
  const auth = createOAuthClientWithRefreshToken(refreshToken);
  const calendar = google.calendar({ version: "v3", auth });

  const { data } = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary,
      description,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
      attendees: attendeeEmails.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  return {
    eventId: data.id ?? null,
    meetLink: data.hangoutLink ?? null,
  };
}

export async function getFreeBusy({
  refreshToken,
  timeMin,
  timeMax,
}: {
  refreshToken: string;
  timeMin: string;
  timeMax: string;
}) {
  const auth = createOAuthClientWithRefreshToken(refreshToken);
  const calendar = google.calendar({ version: "v3", auth });

  const { data } = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: "primary" }],
    },
  });

  return data.calendars?.primary?.busy ?? [];
}
