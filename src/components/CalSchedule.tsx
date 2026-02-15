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
        // padding: "60px 16px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >


      <iframe
        src={`https://cal.com/${CAL_LINK}?embed&theme=dark&layout=month_view`}
        style={{
          width: "100%",
          maxWidth: "1000px",
          height: "600px",
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
