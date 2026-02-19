"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Hook: window width for responsive layout
function useWindowWidth() {
  const [w, setW] = useState(1024);
  useEffect(() => {
    const u = () => setW(window.innerWidth);
    u();
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return w;
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
const WavyText: React.FC<{
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
}> = ({
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
    const characters = text.split("");
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
                width: char === " " ? Math.max(parseInt(fontSize) * 0.35, 4) + "px" : undefined,
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
                style={{ display: "block", lineHeight: `${h}px` }}
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
  };



// ── Stacked Website Mockup Cards ──────────────────────────────────────────
const StackedMockupCards: React.FC<{ title: string; images?: string[] }> = ({
  title,
  images,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // If we have images, create pages from them. Otherwise fall back to a default set.
  const defaultPages = [
    {
      label: "Homepage",
      subtitle: "Where timeless style meets modern grace.",
      image: "",
    },
    {
      label: "Collection",
      subtitle: "Discover our latest seasonal arrivals.",
      image: "",
    },
    { label: "About", subtitle: "Crafted with passion and purpose.", image: "" },
  ];

  const pages =
    images && images.length > 0
      ? images.map((img, i) => ({
        label: `View ${i + 1}`,
        subtitle: "Explore the project details and design.",
        image: img,
      }))
      : defaultPages;

  useEffect(() => {
    // Determine interval speed based on whether we have images or not, usually same is fine
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
        // Calculate offset for cyclic stacking
        const offset = (i - currentIdx + pages.length) % pages.length;

        let yOff = 0;
        let scaleVal = 1;
        let opacityVal = 1;
        let zIdx = 3;
        let rotateZ = 0;

        if (offset === 0) {
          yOff = 0;
          scaleVal = 1;
          opacityVal = 1;
          zIdx = 3;
          rotateZ = 0;
        } else if (offset === 1) {
          yOff = -16;
          scaleVal = 0.94;
          opacityVal = 0.7;
          zIdx = 2;
          rotateZ = -1;
        } else {
          // Send all others to the back stack position
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
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                color: "#1a1a1a",
              }}
            >
              {/* Mini nav */}
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

              {/* Large title area */}
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

              {/* Bottom image area */}
              <div
                style={{
                  height: page.image ? "100%" : "40%",
                  width: "100%",
                  background:
                    "linear-gradient(180deg, #e8e2dc 0%, #d5cec6 100%)",
                  position: page.image ? "absolute" : "relative",
                  top: 0,
                  left: 0,
                  zIndex: page.image ? 10 : 0,
                  overflow: "hidden",
                }}
              >
                {/* If we have an image, show it. Otherwise show default gradient overlay. */}
                {page.image ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${page.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "top center",
                    }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(180,170,158,0.4) 0%, rgba(160,150,138,0.2) 50%, rgba(180,170,158,0.4) 100%)",
                      }}
                    />
                  </>
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "18px",
                    fontSize: "7px",
                    color: page.image ? "#fff" : "#888",
                    textShadow: page.image ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
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

  const windowWidth = useWindowWidth();

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
        padding: windowWidth < 768 ? "20px 16px 16px" : "36px 40px 32px",
        color: "#fff",
        boxShadow:
          "0 4px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
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

      {/* Noise texture */}
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

        {/* Decorative menu icon */}
        {/* <div
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
        </div> */}
      </div>

      {/* ═══════════ MAIN CONTENT (bottom area) ═══════════ */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: windowWidth < 768 ? "1fr" : "1fr 1fr",
          gap: windowWidth < 768 ? "24px" : "40px",
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

        {/* Right column: Stacked mockup cards (hidden on small mobile) */}
        {windowWidth >= 600 && (
          <div
            style={{
              position: "relative",
              height: "100%",
              minHeight: "220px",
              maxHeight: "380px",
            }}
          >
            <StackedMockupCards
              title={title}
              images={project.stackImages}
            />
          </div>
        )}
      </div>


    </div>
  );
};

export default ProjectCard;
