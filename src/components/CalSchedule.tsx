"use client";

import React from "react";

const CalSchedule: React.FC = () => {
  const CAL_LINK = "neuronui/30min";

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 16px",
        gap: "48px",
      }}
    >
      {/* ── "Let's work together" heading ─────────────────────── */}
      <div
        style={{
          textAlign: "center",
          maxWidth: "700px",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: "16px",
          }}
        >
          GET IN TOUCH
        </span>
        <h2
          style={{
            fontFamily: "var(--font-serif), 'DM Serif Display', serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 400,
            lineHeight: 1.1,
            color: "#fff",
            letterSpacing: "-1px",
            margin: 0,
          }}
        >
          Let&apos;s work together
        </h2>
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.4)",
            marginTop: "16px",
            maxWidth: "480px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Book a call and let&apos;s bring your next project to life.
        </p>
      </div>

      {/* ── Cal.com embed ──────────────────────────────────────── */}
      <iframe
        src={`https://cal.com/${CAL_LINK}?embed&theme=dark&layout=month_view`}
        style={{
          width: "100%",
          maxWidth: "1000px",
          height: "min(600px, 70vh)",
          minHeight: "350px",
          border: "none",
          borderRadius: "16px",
          colorScheme: "dark",
        }}
        loading="lazy"
        allow="payment"
      />
    </section>
  );
};

export default CalSchedule;
