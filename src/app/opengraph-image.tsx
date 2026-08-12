import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -1 }}>Pivotroom.africa</div>
        <div style={{ fontSize: 32, color: "rgba(237,237,237,0.7)" }}>
          Book 1:1 sessions with African experts
        </div>
      </div>
    ),
    { ...size },
  );
}
