"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface ProjectData {
  title: string;
  description: string;
  hash: string;
  tags: string[];
  siteUrl?: string;
  creditLabel?: string;
  previewImages?: string[];
}

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  total: number;
  progressRef?: (el: SVGCircleElement | null) => void;
}

// ── Auto-rotating preview slideshow ──
const PreviewSlideshow: React.FC<{ title: string }> = ({ title }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const gradientSlides = [
    "linear-gradient(145deg, #1a1a1e 0%, #131316 40%, #0e0e11 100%)",
    "linear-gradient(135deg, #1e1a1a 0%, #161313 40%, #110e0e 100%)",
    "linear-gradient(155deg, #1a1e1a 0%, #131613 40%, #0e110e 100%)",
    "linear-gradient(125deg, #1e1a1e 0%, #161316 40%, #110e11 100%)",
  ];

  const navItems = [
    ["Shop", "About", "Cart"],
    ["Products", "Blog", "Contact"],
    ["Collection", "Story", "Login"],
    ["Explore", "Studio", "Menu"],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % gradientSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [gradientSlides.length]);

  const items = navItems[currentIdx % navItems.length];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit" }}>
      {/* Background with crossfade */}
      {gradientSlides.map((grad, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            background: grad,
            opacity: i === currentIdx ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />
      ))}

      {/* Texture overlays */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "60%", height: "100%", background: "linear-gradient(210deg, rgba(45,42,50,0.7) 0%, rgba(30,28,35,0.5) 30%, transparent 70%)", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: 0, left: "5%", width: "90%", height: "50%", background: "linear-gradient(0deg, rgba(35,33,40,0.4) 0%, transparent 80%)", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "10%", right: "-5%", width: "45%", height: "120%", background: "linear-gradient(155deg, transparent 0%, rgba(55,50,60,0.15) 40%, rgba(40,38,45,0.1) 60%, transparent 100%)", transform: `rotate(${-10 + currentIdx * 5}deg)`, transition: "transform 0.8s ease", zIndex: 1 }} />

      {/* Mock site content */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1.5px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{title}</span>
          <div style={{ display: "flex", gap: "16px" }}>
            {items.map((item) => (
              <span key={item} style={{ fontSize: "8px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px", textTransform: "uppercase" }}>{item}</span>
            ))}
          </div>
        </div>
        {/* Center title */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <span style={{ fontFamily: "var(--font-serif), 'DM Serif Display', serif", fontSize: "clamp(36px, 4vw, 64px)", color: "#fff", fontWeight: 400, letterSpacing: "-1px", textShadow: "0 2px 30px rgba(0,0,0,0.6)" }}>{title}</span>
        </div>
        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.12)", letterSpacing: "0.5px" }}>Scroll to explore</span>
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 10 }}>
        {gradientSlides.map((_, i) => (
          <div key={i} style={{ width: i === currentIdx ? "16px" : "4px", height: "4px", borderRadius: "2px", backgroundColor: i === currentIdx ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)", transition: "all 0.4s ease" }} />
        ))}
      </div>
    </div>
  );
};

// ── Circular progress indicator ──
const CIRCLE_RADIUS = 32;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  total,
  progressRef,
}) => {
  const { title, description, hash, tags, creditLabel = "Content Earth" } = project;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        background: "#141414",
        position: "relative",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        padding: "32px 36px 28px",
        gap: "0 36px",
        color: "#fff",
        boxShadow: "0 4px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Background effects */}
      <div style={{ position: "absolute", top: "-10%", left: "15%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(120,120,120,0.18) 0%, rgba(80,80,80,0.06) 40%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "-20%", right: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(90,90,90,0.08) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, pointerEvents: "none", zIndex: 1 }} />

      {/* === LEFT COLUMN === */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Circular progress with project number */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative", width: "74px", height: "74px" }}>
            {/* Background circle */}
            <svg
              width="74"
              height="74"
              viewBox="0 0 74 74"
              style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}
            >
              <circle
                cx="37"
                cy="37"
                r={CIRCLE_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
              />
              {/* Progress arc */}
              <circle
                ref={progressRef}
                cx="37"
                cy="37"
                r={CIRCLE_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                strokeDashoffset={CIRCLE_CIRCUMFERENCE}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            {/* Number inside circle */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "8px", letterSpacing: "1.5px", color: "#555", fontWeight: 600, textTransform: "uppercase", lineHeight: 1 }}>
                PROJECT
              </span>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: "#333" }}>/</span>
            <span style={{ fontSize: "13px", color: "#333" }}>
              {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Title + Description + CTA */}
        <div style={{ paddingRight: "10px" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif), 'DM Serif Display', serif",
              fontSize: "clamp(42px, 4.5vw, 72px)",
              fontWeight: 400,
              lineHeight: 1.0,
              marginBottom: "18px",
              color: "#fff",
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: "13px", lineHeight: 1.75, color: "#777", maxWidth: "420px", marginBottom: "32px" }}>
            {description}
          </p>
          <motion.a
            href={project.siteUrl || "#"}
            whileHover={{ gap: "14px" }}
            transition={{ duration: 0.2 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: "#fff", textDecoration: "none",
              cursor: "pointer", paddingBottom: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.12)", width: "fit-content",
            }}
          >
            VISIT SITE
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </motion.a>
        </div>
        <div />
      </div>

      {/* === RIGHT COLUMN === */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Hash + Tags */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
          <span style={{ fontSize: "9.5px", letterSpacing: "1.8px", color: "#3d3d3d", fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace" }}>
            {hash}
          </span>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {tags.map((tag) => (
              <span key={tag} style={{ fontSize: "8.5px", fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: "#555", padding: "4px 9px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Preview with auto-rotating slideshow */}
        <div style={{ flex: 1, borderRadius: "14px", overflow: "hidden", position: "relative", background: "#111", minHeight: "200px" }}>
          <PreviewSlideshow title={title} />
        </div>

        {/* Credit */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "2px" }}>
          <span style={{ fontSize: "10.5px", color: "#3a3a3a", letterSpacing: "0.3px", fontStyle: "italic" }}>
            {creditLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
