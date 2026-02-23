"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// ── Breakpoint hook (debounced, returns breakpoint string, not pixel width) ──
// This prevents re-renders on every pixel of resize — only triggers when
// crossing a breakpoint boundary.
function useBreakpoint() {
  const getBreakpoint = () => {
    if (typeof window === "undefined") return "lg";
    const w = window.innerWidth;
    if (w < 600) return "sm";
    if (w < 768) return "md";
    return "lg";
  };

  const [bp, setBp] = useState(getBreakpoint);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setBp(getBreakpoint());
      }, 150); // 150ms debounce — resize events won't thrash renders
    };
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
      clearTimeout(timeout);
    };
  }, []);

  return bp;
}

export interface ProjectData {
  title: string;
  description: string;
  hash: string;
  tags: string[];
  siteUrl?: string;
  creditLabel?: string;
  previewImages?: string[];
  stackImages?: string[];
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

// ── Wavy hover text (per-character wave) ──────────────────────────────────
// Performance: Only animates translateY (GPU-compositable), adds will-change
// only during hover, removes it after animation completes.
const WavyText = memo<{
  text: string;
  href?: string;
  onClick?: () => void;
  fontSize?: string;
  color?: string;
  hoverColor?: string;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: string;
  border?: boolean;
}>(
  ({
    text,
    href,
    onClick,
    fontSize = "11px",
    color = "#fff",
    hoverColor,
    fontFamily,
    fontWeight = 600,
    letterSpacing = "2px",
    border = false,
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const characters = useMemo(() => text.split(""), [text]);
    const h = parseInt(fontSize) + 4;

    const inner = (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: border ? "10px" : undefined,
          padding: border ? "12px 24px" : undefined,
          border: border ? "1px solid rgba(255,255,255,0.15)" : undefined,
          borderRadius: border ? "30px" : undefined,
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span
          style={{
            display: "inline-flex",
            height: `${h}px`,
            overflow: "hidden",
          }}
        >
          {characters.map((char, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                overflow: "hidden",
                height: `${h}px`,
                width:
                  char === " "
                    ? Math.max(parseInt(fontSize) * 0.35, 4) + "px"
                    : undefined,
              }}
            >
              <motion.span
                animate={{ y: isHovered ? -h : 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  delay: i * 0.025,
                }}
                style={{
                  display: "block",
                  lineHeight: `${h}px`,
                  // Only promote to GPU layer during animation
                  willChange: isHovered ? "transform" : "auto",
                }}
              >
                <span
                  style={{
                    display: "block",
                    height: `${h}px`,
                    fontSize,
                    fontWeight,
                    letterSpacing,
                    textTransform: "uppercase",
                    color: hoverColor && isHovered ? hoverColor : color,
                    fontFamily,
                    transition: "color 0.2s",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
                <span
                  style={{
                    display: "block",
                    height: `${h}px`,
                    fontSize,
                    fontWeight,
                    letterSpacing,
                    textTransform: "uppercase",
                    color: hoverColor || color,
                    fontFamily,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              </motion.span>
            </span>
          ))}
        </span>
      </span>
    );

    if (href) {
      return (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={onClick}
        >
          {inner}
        </a>
      );
    }

    return (
      <button
        onClick={onClick}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "inherit",
        }}
      >
        {inner}
      </button>
    );
  },
);
WavyText.displayName = "WavyText";

// ── Stacked Website Mockup Cards ──────────────────────────────────────────
// Performance: Removed filter: blur() and brightness() from animation —
// these are NOT GPU-compositable and cause full repaint on every frame.
// Replaced with pure opacity + transform (translateY + scale) which are
// compositor-only operations. Added CSS containment.
const StackedMockupCards = memo<{ title: string; images?: string[] }>(
  ({ title, images }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

    // Memoize pages array to prevent re-creation on every render
    const pages = useMemo(() => {
      if (images && images.length > 0) {
        return images.map((img, i) => ({
          label: `View ${i + 1}`,
          image: img,
        }));
      }
      return [
        { label: "Homepage", image: "" },
        { label: "Collection", image: "" },
        { label: "About", image: "" },
      ];
    }, [images]);

    useEffect(() => {
      intervalRef.current = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % pages.length);
      }, 4000);
      return () => clearInterval(intervalRef.current);
    }, [pages.length]);

    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          // Removed perspective: 1000px — it forces 3D compositing context
          // on ALL children, massively increasing GPU memory usage.
          // The stacking effect is achieved purely with translateY + scale.
          contain: "layout style paint",
        }}
      >
        {pages.map((page, i) => {
          const relativeIndex = (i - currentIdx + pages.length) % pages.length;

          // Performance: Only render top 3 cards. Others are display:none
          // to completely remove them from the compositing tree.
          if (relativeIndex >= 3) return null;

          // Pure transform + opacity values (NO filter)
          let yOff = 0;
          let scaleVal = 1;
          let opacityVal = 1;
          let zIdx = 3;

          if (relativeIndex === 0) {
            yOff = 0;
            scaleVal = 1;
            opacityVal = 1;
            zIdx = 10;
          } else if (relativeIndex === 1) {
            yOff = -12;
            scaleVal = 0.95;
            opacityVal = 0.65; // Simulate "darker" via opacity instead of brightness filter
            zIdx = 5;
          } else if (relativeIndex === 2) {
            yOff = -24;
            scaleVal = 0.9;
            opacityVal = 0.35;
            zIdx = 1;
          }

          return (
            <motion.div
              key={i}
              animate={{
                y: yOff,
                scale: scaleVal,
                opacity: opacityVal,
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "absolute",
                top: "10%",
                left: "5%",
                right: "5%",
                bottom: "5%",
                borderRadius: "16px",
                background: "#1a1a1a",
                overflow: "hidden",
                zIndex: zIdx,
                // GPU-only: boxShadow is static, not animated
                boxShadow:
                  relativeIndex === 0
                    ? "0 12px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08) inset"
                    : "none",
                pointerEvents: relativeIndex === 0 ? "auto" : "none",
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {page.image ? (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#0d0d0d",
                    }}
                  >
                    <Image
                      src={page.image}
                      alt={page.label}
                      fill
                      sizes="(max-width: 768px) 45vw, 30vw"
                      style={{ objectFit: "contain" }}
                      loading="lazy"
                    />
                    {/* Label Overlay — removed backdropFilter: blur() */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "12px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background: "rgba(0,0,0,0.7)",
                        fontSize: "9px",
                        color: "#fff",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        pointerEvents: "none",
                        zIndex: 2,
                      }}
                    >
                      {page.label}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div style={{ display: "flex", gap: "6px" }}>
                        {[0, 1, 2].map((d) => (
                          <div
                            key={d}
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background:
                                d === 0
                                  ? "#ff5f56"
                                  : d === 1
                                    ? "#ffbd2e"
                                    : "#27c93f",
                            }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          fontSize: "8px",
                          color: "#555",
                          letterSpacing: "1px",
                        }}
                      >
                        NEURON UI
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "0 24px",
                        background: "#121212",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "var(--font-serif), serif",
                          fontSize: "24px",
                          color: "#fff",
                          marginBottom: "8px",
                        }}
                      >
                        {title}
                      </h3>
                      <p style={{ fontSize: "10px", color: "#666" }}>
                        Explore the project details and design.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  },
);
StackedMockupCards.displayName = "StackedMockupCards";

// ── Main ProjectCard Component ────────────────────────────────────────────
// Performance: Wrapped in React.memo, uses breakpoint instead of pixel width,
// CSS containment added, blur reduced from 20px to 8px with extra scale to
// compensate (blur edge artifacts hidden by scale), boxShadow reduced.
const ProjectCard = memo<ProjectCardProps>(
  ({ project, index, total, progressRef, gradient, backgroundImage }) => {
    const {
      title,
      description,
      hash,
      tags,
      creditLabel = "Content Earth",
      category = "ECOMMERCE WEBSITE",
    } = project;

    const bp = useBreakpoint();
    const isMobile = bp === "sm" || bp === "md";
    const showMockups = bp !== "sm";

    // Memoize static computed values
    const padding = isMobile ? "20px 16px 16px" : "36px 40px 32px";
    const gridCols = isMobile ? "1fr" : "1fr 1fr";
    const gridGap = isMobile ? "24px" : "40px";

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
          padding,
          color: "#fff",
          // Reduced shadow blur from 60px → 32px for less paint cost
          boxShadow:
            "0 4px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
          // CSS Containment: tells browser this subtree is independent,
          // enabling massive paint optimization
          contain: "layout style paint",
        }}
      >
        {/* Background image layer */}
        {backgroundImage && (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 0,
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

        {/* Noise texture — using will-change: auto to avoid unnecessary promotion */}
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
          {/* Right side: Category + Tags */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "10px",
            }}
          >
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

            <div
              style={{
                width: "100%",
                height: "1px",
                background: "rgba(255,255,255,0.08)",
                marginTop: "4px",
              }}
            />
          </div>
        </div>

        {/* ═══════════ MAIN CONTENT (bottom area) ═══════════ */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: gridGap,
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
            <WavyText
              text="VISIT SITE"
              href={project.siteUrl || "#"}
              fontSize="11px"
              border
            />
          </div>

          {/* Right column: Stacked mockup cards */}
          {showMockups && (
            <div
              style={{
                position: "relative",
                height: "100%",
                minHeight: "220px",
                maxHeight: "380px",
              }}
            >
              <StackedMockupCards title={title} images={project.stackImages} />
            </div>
          )}
        </div>
      </div>
    );
  },
);
ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
