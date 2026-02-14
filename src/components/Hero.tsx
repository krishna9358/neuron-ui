"use client";

import React from "react";
import Carousel from "./Carousel";

const Hero = () => {
  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "#F8F4F1",
        overflow: "hidden",
      }}
    >
      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.05,
          backgroundImage: `
            linear-gradient(rgba(17,69,160,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(17,69,160,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* "Make it real" Background Text */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translate(-50%, -75%) rotate(-1deg)",
          zIndex: 2,
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "baseline",
          gap: "0.15em",
        }}
      >
        {/* "Make" in brush script font */}
        <span
          style={{
            fontFamily: "var(--font-title), cursive",
            fontSize: "clamp(80px, 14vw, 200px)",
            lineHeight: 0.9,
            color: "#1a1a1a",
            margin: 0,
            padding: 0,
            letterSpacing: "-1px",
          }}
        >
          Make 
        </span>
        {/* "it real" in normal Inter font */}
        <span
          style={{
            fontFamily: "inherit",
            fontSize: "clamp(70px, 12vw, 180px)",
            lineHeight: 0.9,
            color: "#1a1a1a",
            margin: 0,
            padding: 0,
            fontWeight: 700,
            letterSpacing: "-3px",
          }}
        >
         &nbsp; it real
        </span>
      </div>

      {/* Carousel - centered over the text */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1100px",
          height: "55vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "100px",
          top: "70px",
        }}
      >
        <Carousel />
      </div>

      {/* Subtitle + Buttons */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          paddingBottom: "40px",
          top: "20px",
        }}
      >
        <p
          style={{
            color: "#555",
            fontSize: "18px",
            fontWeight: 400,
            letterSpacing: "0.3px",
          }}
        >
          A new way to design for the real world
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              backgroundColor: "#1145A0",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 28px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#0d3680")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#1145A0")
            }
          >
            Get Started
          </button>
          <button
            style={{
              backgroundColor: "#fff",
              color: "#1145A0",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 28px",
              borderRadius: "8px",
              border: "1.5px solid #1145A0",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#eef2f9")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#fff")
            }
          >
            Book a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
