"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Carousel from "./Carousel";
// Navbar moved to page.tsx to avoid stacking context issues with sticky/overflow:hidden

// ── Config ──────────────────────────────────────────────────────────
const FRAME_COUNT = 240;
const SECTION_HEIGHT_VH = 950; // One tall section for everything

// Carousel center card (must match Carousel.tsx)
const CARD_WIDTH = 340;
const CARD_HEIGHT = CARD_WIDTH * (10 / 16); // 212.5px
const CARD_RADIUS = 12;

// Use smaller dimensions on mobile for the clip-path zoom
function getCardDims(w: number) {
  if (w < 480) return { cw: 200, ch: 200 * (10 / 16) };
  if (w < 768) return { cw: 260, ch: 260 * (10 / 16) };
  return { cw: CARD_WIDTH, ch: CARD_HEIGHT };
}

// Scroll phase boundaries (fraction of total scrollable range)
const CONTENT_FADE_START = 0.04;
const CONTENT_FADE_END = 0.15;
const CANVAS_APPEAR = 0.06;
const CANVAS_SOLID = 0.10;
const ZOOM_START = 0.06;
const ZOOM_END = 0.20;
const BG_START = 0.08;
const BG_END = 0.20;
const FRAMES_START = 0.20;
const FRAMES_END = 0.85;
const ZOOMOUT_START = 0.85;

// ── Helpers ─────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

// ── Component ───────────────────────────────────────────────────────
const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressWrapRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const winRef = useRef({ w: 0, h: 0 });

  // ── Window size tracking ──────────────────────────────────────────
  useEffect(() => {
    const sync = () => {
      winRef.current = { w: window.innerWidth, h: window.innerHeight };
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // ── Preload all 240 frames ────────────────────────────────────────
  useEffect(() => {
    let count = 0;
    const imgs: HTMLImageElement[] = [];
    const onDone = () => {
      count++;
      setLoadProgress(Math.round((count / FRAME_COUNT) * 100));
      if (count >= FRAME_COUNT) {
        imagesRef.current = imgs;
        setIsLoaded(true);
      }
    };
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames-01/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;
      img.onload = onDone;
      img.onerror = onDone;
      imgs.push(img);
    }
    return () => {
      imgs.forEach((i) => {
        i.onload = null;
        i.onerror = null;
      });
    };
  }, []);

  // ── Draw a frame on the canvas (cover mode, retina) ───────────────
  const drawFrame = useCallback((idx: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[idx];
    if (!img?.complete || !img.naturalWidth) return;

    const dpr = window.devicePixelRatio || 1;
    const { w, h } = winRef.current;
    const tw = Math.round(w * dpr);
    const th = Math.round(h * dpr);
    if (c.width !== tw || c.height !== th) {
      c.width = tw;
      c.height = th;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw: number, dh: number;
    if (ir > cr) {
      dh = h;
      dw = h * ir;
    } else {
      dw = w;
      dh = w / ir;
    }
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }, []);

  // ── Main scroll handler ───────────────────────────────────────────
  const navbarHiddenRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;
    drawFrame(0);

    const update = () => {
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      const content = contentRef.current;
      const canvas = canvasRef.current;
      const pBar = progressBarRef.current;
      const pWrap = progressWrapRef.current;
      if (!section || !sticky || !content || !canvas) return;

      const rect = section.getBoundingClientRect();
      const { w: vw, h: vh } = winRef.current;

      // ── BEFORE: section top below viewport top ──
      if (rect.top > 0) {
        content.style.opacity = "1";
        content.style.transform = "none";
        canvas.style.opacity = "0";
        canvas.style.clipPath = "";
        canvas.style.filter = "";
        sticky.style.backgroundColor = "#F8F4F1";
        if (pWrap) pWrap.style.opacity = "0";
        // Show navbar when before the section
        if (navbarHiddenRef.current) {
          navbarHiddenRef.current = false;
          window.dispatchEvent(new Event("navbar:show"));
        }
        return;
      }

      // ── AFTER: section fully scrolled past ──
      if (rect.bottom <= vh) {
        content.style.opacity = "0";
        // Keep the final zoomed-out state so it doesn't snap back to full-screen
        canvas.style.clipPath = "inset(30px 40px 30px 40px round 24px)";
        canvas.style.opacity = "0.6"; // Matches (1 - 1.0 * 0.4)
        canvas.style.transform = "scale(0.92)"; // Matches (1 - 1.0 * 0.08)
        canvas.style.filter = "none";
        sticky.style.backgroundColor = "#0a0a0a";
        if (frameRef.current !== FRAME_COUNT - 1) {
          frameRef.current = FRAME_COUNT - 1;
          drawFrame(FRAME_COUNT - 1);
        }
        if (pWrap) pWrap.style.opacity = "0";
        // Keep navbar hidden after the hero
        if (!navbarHiddenRef.current) {
          navbarHiddenRef.current = true;
          window.dispatchEvent(new Event("navbar:hide"));
        }
        return;
      }

      // ── PINNED ──
      const scrolled = -rect.top;
      const range = section.offsetHeight - vh;
      const progress = clamp01(scrolled / range);

      // ── Navbar hide/show based on scroll progress ──
      if (progress >= CONTENT_FADE_START && !navbarHiddenRef.current) {
        navbarHiddenRef.current = true;
        window.dispatchEvent(new Event("navbar:hide"));
      } else if (progress < CONTENT_FADE_START && navbarHiddenRef.current) {
        navbarHiddenRef.current = false;
        window.dispatchEvent(new Event("navbar:show"));
      }

      // ─── Hero content fade ───
      if (progress < CONTENT_FADE_START) {
        content.style.opacity = "1";
        content.style.transform = "none";
      } else {
        const ft = clamp01(
          (progress - CONTENT_FADE_START) /
          (CONTENT_FADE_END - CONTENT_FADE_START)
        );
        content.style.opacity = String(1 - ft);
        content.style.transform = `translateY(${-ft * 60}px) scale(${1 - ft * 0.04})`;
      }

      // ─── Canvas: zoom via clip-path → then full-screen frames ───
      if (progress < CANVAS_APPEAR) {
        // Hidden
        canvas.style.opacity = "0";
        if (pWrap) pWrap.style.opacity = "0";
      } else if (progress < ZOOM_END) {
        // ── ZOOM PHASE: single canvas revealed through expanding clip-path ──
        const appear = clamp01(
          (progress - CANVAS_APPEAR) / (CANVAS_SOLID - CANVAS_APPEAR)
        );
        canvas.style.opacity = String(appear);

        // Clip-path: card-sized center rectangle → full viewport
        const zr = clamp01(
          (progress - ZOOM_START) / (ZOOM_END - ZOOM_START)
        );
        const zt = easeOutCubic(zr);

        const { cw, ch } = getCardDims(vw);
        const insetX = lerp((vw - cw) / 2, 0, zt);
        const insetY = lerp((vh - ch) / 2, 0, zt);
        const rad = lerp(CARD_RADIUS, 0, zt);
        canvas.style.clipPath = `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px round ${rad}px)`;

        // Grayscale + drop-shadow (like the carousel center card)
        const gs = lerp(100, 0, zt);
        const sBlur = lerp(40, 0, zt);
        const sAlpha = lerp(0.2, 0, zt);
        canvas.style.filter =
          gs > 1
            ? `grayscale(${gs}%) drop-shadow(0 10px ${sBlur}px rgba(0,0,0,${sAlpha}))`
            : "none";

        // Show frame 0 during zoom
        if (frameRef.current !== 0) {
          frameRef.current = 0;
          drawFrame(0);
        }
        if (pWrap) pWrap.style.opacity = "0";
      } else if (progress < FRAMES_END) {
        // ── FRAME ANIMATION PHASE: full-screen canvas, frames 1→240 ──
        canvas.style.opacity = "1";
        canvas.style.clipPath = "none";
        canvas.style.filter = "none";
        canvas.style.transform = "none";
        canvas.style.borderRadius = "0";

        const fp = clamp01(
          (progress - FRAMES_START) / (FRAMES_END - FRAMES_START)
        );
        const idx = Math.round(fp * (FRAME_COUNT - 1));

        if (idx !== frameRef.current) {
          frameRef.current = idx;
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => drawFrame(idx));
        }

        if (pBar) pBar.style.width = `${fp * 100}%`;
        if (pWrap) pWrap.style.opacity = fp < 0.95 ? "1" : "0";
      } else {
        // ── ZOOM-OUT PHASE: canvas shrinks into a card shape ──
        const zp = clamp01(
          (progress - ZOOMOUT_START) / (1.0 - ZOOMOUT_START)
        );
        const zt = easeOutCubic(zp);

        // Show last frame
        if (frameRef.current !== FRAME_COUNT - 1) {
          frameRef.current = FRAME_COUNT - 1;
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() =>
            drawFrame(FRAME_COUNT - 1)
          );
        }

        // Shrink canvas with clip-path inset + border-radius
        const insetX = lerp(0, 40, zt);
        const insetY = lerp(0, 30, zt);
        const rad = lerp(0, 24, zt);
        canvas.style.clipPath = `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px round ${rad}px)`;
        canvas.style.opacity = String(1 - zt * 0.4);
        canvas.style.transform = `scale(${1 - zt * 0.08})`;
        canvas.style.filter = "none";

        if (pWrap) pWrap.style.opacity = "0";
      }

      // ─── Background: light → dark ───
      if (progress < BG_START) {
        sticky.style.backgroundColor = "#F8F4F1";
      } else if (progress < BG_END) {
        const bt = easeOutCubic(
          clamp01((progress - BG_START) / (BG_END - BG_START))
        );
        sticky.style.backgroundColor = `rgb(${Math.round(lerp(248, 10, bt))},${Math.round(lerp(244, 10, bt))},${Math.round(lerp(241, 10, bt))})`;
      } else {
        sticky.style.backgroundColor = "#0a0a0a";
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    const onResize = () => drawFrame(frameRef.current);
    window.addEventListener("resize", onResize);
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isLoaded, drawFrame]);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: `${SECTION_HEIGHT_VH}vh`,
        backgroundColor: "#0a0a0a",
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#F8F4F1",
        }}
      >
        {/* Navbar rendered in page.tsx to stay above all stacking contexts */}

        {/* ──── Hero content (fades out on scroll) ──── */}
        <div
          ref={contentRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            willChange: "opacity, transform",
          }}
        >
          {/* Grid pattern */}
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

          {/* "Make it real" text */}
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
            <span
              style={{
                fontFamily: "var(--font-title), cursive",
                fontSize: "clamp(80px, 14vw, 200px)",
                lineHeight: 0.9,
                color: "#1a1a1a",
                letterSpacing: "-1px",
              }}
            >
              Make
            </span>
            <span
              style={{
                fontFamily: "inherit",
                fontSize: "clamp(70px, 12vw, 180px)",
                lineHeight: 0.9,
                color: "#1a1a1a",
                fontWeight: 700,
                letterSpacing: "-3px",
              }}
            >
              &nbsp; it real
            </span>
          </div>

          {/* Carousel */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              maxWidth: "1100px",
              height: "45vh",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "60px",
              top: "40px",
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
                fontSize: "clamp(14px, 2.5vw, 18px)",
                fontWeight: 400,
                letterSpacing: "0.3px",
                textAlign: "center",
              }}
            >
              A new way to design for the real world
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                style={{
                  backgroundColor: "#1145A0",
                  color: "#fff",
                  fontSize: "clamp(12px, 2vw, 14px)",
                  fontWeight: 600,
                  padding: "10px 24px",
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
                  fontSize: "clamp(12px, 2vw, 14px)",
                  fontWeight: 600,
                  padding: "10px 24px",
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
        </div>

        {/* ──── Single canvas: clip-path zoom + frame animation ──── */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            zIndex: 10,
            pointerEvents: "none",
            willChange: "clip-path, filter, opacity",
          }}
        />

        {/* ──── Loading indicator (visible while frames preload) ──── */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            zIndex: 20,
            opacity: isLoaded ? 0 : 1,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "3px",
              backgroundColor: "rgba(0,0,0,0.08)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${loadProgress}%`,
                height: "100%",
                backgroundColor: "#1145A0",
                borderRadius: "2px",
                transition: "width 0.15s ease-out",
              }}
            />
          </div>
          <span
            style={{
              color: "rgba(0,0,0,0.3)",
              fontSize: "12px",
              fontWeight: 400,
            }}
          >
            {loadProgress}%
          </span>
        </div>

        {/* ──── Scroll progress indicator (frames phase) ──── */}
        <div
          ref={progressWrapRef}
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            opacity: 0,
            transition: "opacity 0.4s ease",
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: "120px",
              height: "2px",
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: "1px",
              overflow: "hidden",
            }}
          >
            <div
              ref={progressBarRef}
              style={{
                width: "0%",
                height: "100%",
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: "1px",
              }}
            />
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "11px",
              fontWeight: 400,
              letterSpacing: "1px",
              textTransform: "uppercase" as const,
            }}
          >
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
