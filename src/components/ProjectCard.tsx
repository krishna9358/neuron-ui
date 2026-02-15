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
  category?: string;
}

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  total: number;
  progressRef?: (el: SVGCircleElement | null) => void;
  gradient?: string;
  backgroundImage?: string;
}

// ── Wavy hover link (per-character wave, same as Navbar) ──────────────────
const WavyLink: React.FC<{
  text: string;
  href: string;
  icon?: React.ReactNode;
}> = ({ text, href, icon }) => {
  const [isHovered, setIsHovered] = useState(false);
  const characters = text.split("");

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: "#fff",
        textDecoration: "none",
        cursor: "pointer",
        padding: "12px 24px",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "30px",
        width: "fit-content",
        transition: "border-color 0.3s ease",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          height: "14px",
          overflow: "hidden",
        }}
      >
        {characters.map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              height: "14px",
              width: char === " " ? "4px" : undefined,
            }}
          >
            <motion.span
              animate={{ y: isHovered ? -14 : 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: i * 0.025,
              }}
              style={{ display: "block", lineHeight: "14px" }}
            >
              <span style={{ display: "block", height: "14px" }}>
                {char === " " ? "\u00A0" : char}
              </span>
              <span style={{ display: "block", height: "14px" }}>
                {char === " " ? "\u00A0" : char}
              </span>
            </motion.span>
          </span>
        ))}
      </span>
      {icon}
    </motion.a>
  );
};

// ── Stacked Website Mockup Cards ──────────────────────────────────────────
const StackedMockupCards: React.FC<{ title: string }> = ({ title }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const pages = [
    { label: "Homepage", subtitle: "Where timeless style meets modern grace." },
    { label: "Collection", subtitle: "Discover our latest seasonal arrivals." },
    { label: "About", subtitle: "Crafted with passion and purpose." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % pages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [pages.length]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {pages.map((page, i) => {
        const offset = (i - currentIdx + pages.length) % pages.length;

        let yOff = 0;
        let scaleVal = 1;
        let opacityVal = 1;
        let zIdx = 3;
        let rotateZ = 0;

        if (offset === 0) {
          // Active card (front)
          yOff = 0;
          scaleVal = 1;
          opacityVal = 1;
          zIdx = 3;
          rotateZ = 0;
        } else if (offset === 1) {
          // Behind 1 — peek from top
          yOff = -16;
          scaleVal = 0.94;
          opacityVal = 0.7;
          zIdx = 2;
          rotateZ = -1;
        } else {
          // Behind 2 — peek further
          yOff = -30;
          scaleVal = 0.88;
          opacityVal = 0.4;
          zIdx = 1;
          rotateZ = -2;
        }

        return (
          <motion.div
            key={i}
            animate={{
              y: yOff,
              scale: scaleVal,
              opacity: opacityVal,
              rotate: rotateZ,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              right: "12px",
              bottom: "12px",
              borderRadius: "14px",
              background: "#f5f0eb",
              zIndex: zIdx,
              overflow: "hidden",
              boxShadow:
                offset === 0
                  ? "0 12px 48px rgba(0,0,0,0.3)"
                  : "0 6px 24px rgba(0,0,0,0.15)",
            }}
          >
            {/* White card — website mockup with dark text */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                color: "#1a1a1a",
              }}
            >
              {/* Mini navigation bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 18px",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "1.2px",
                    color: "#444",
                    textTransform: "uppercase",
                  }}
                >
                  Shop
                </span>
                <div style={{ display: "flex", gap: "14px" }}>
                  {["Search", "Profile", "Cart (0)"].map((item) => (
                    <span
                      key={item}
                      style={{
                        fontSize: "7.5px",
                        color: "#888",
                        letterSpacing: "0.8px",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Large title */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 24px",
                }}
              >
                <h3
                  style={{
                    fontFamily:
                      "var(--font-serif), 'DM Serif Display', serif",
                    fontSize: "clamp(28px, 3vw, 48px)",
                    fontWeight: 400,
                    lineHeight: 1.0,
                    color: "#1a1a1a",
                    marginBottom: "8px",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "9px",
                    color: "#999",
                    letterSpacing: "0.3px",
                    lineHeight: 1.5,
                    maxWidth: "250px",
                  }}
                >
                  {page.subtitle}
                </p>
              </div>

              {/* Bottom section with image placeholder */}
              <div
                style={{
                  height: "40%",
                  background:
                    "linear-gradient(180deg, #e8e2dc 0%, #d5cec6 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Shimmer / mock image */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(180,170,158,0.4) 0%, rgba(160,150,138,0.2) 50%, rgba(180,170,158,0.4) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "18px",
                    fontSize: "7px",
                    color: "#888",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {page.label}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ── Main ProjectCard Component ────────────────────────────────────────────
const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  total,
  progressRef,
  gradient,
  backgroundImage,
}) => {
  const {
    title,
    description,
    hash,
    tags,
    creditLabel = "Content Earth",
    category = "ECOMMERCE WEBSITE",
  } = project;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        background: gradient || "#141414",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "36px 40px 32px",
        color: "#fff",
        boxShadow:
          "0 4px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Background image layer (e.g. last Hero frame for seamless transition) */}
      {backgroundImage && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "inherit",
              zIndex: 0,
              filter: "blur(20px)",
              transform: "scale(1.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.85) 100%)",
              borderRadius: "inherit",
              zIndex: 0,
            }}
          />
        </>
      )}

      {/* Background noise texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ═══════════ TOP ROW ═══════════ */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          marginBottom: "auto",
        }}
      >
        {/* Right side: Category + Tags + Menu icon */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >
          {/* Category label */}
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "3px",
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
            }}
          >
            {category}
          </span>

          {/* Tags as inline text with dots */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0",
            }}
          >
            {tags.map((tag, i) => (
              <React.Fragment key={tag}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {tag}
                </span>
                {i < tags.length - 1 && (
                  <span
                    style={{
                      margin: "0 8px",
                      color: "rgba(255,255,255,0.2)",
                      fontSize: "10px",
                    }}
                  >
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Separator line */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background: "rgba(255,255,255,0.08)",
              marginTop: "4px",
            }}
          />
        </div>

        {/* Menu icon (far right) */}
        <div
          style={{
            marginLeft: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            paddingTop: "4px",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: "16px",
                height: "1.5px",
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: "1px",
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══════════ MAIN CONTENT (bottom area) ═══════════ */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "end",
          flex: 1,
        }}
      >
        {/* Left column: Title + Description + CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: "0",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-serif), 'DM Serif Display', serif",
              fontSize: "clamp(48px, 5vw, 80px)",
              fontWeight: 400,
              lineHeight: 1.0,
              marginBottom: "20px",
              color: "#fff",
              letterSpacing: "-1px",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.55)",
              maxWidth: "380px",
              marginBottom: "28px",
            }}
          >
            {description}
          </p>
          <WavyLink
            text="VISIT SITE"
            href={project.siteUrl || "#"}
            icon={
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            }
          />
        </div>

        {/* Right column: Stacked mockup cards */}
        <div
          style={{
            position: "relative",
            height: "100%",
            minHeight: "280px",
            maxHeight: "380px",
          }}
        >
          <StackedMockupCards title={title} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
