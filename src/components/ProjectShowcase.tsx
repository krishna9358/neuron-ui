"use client";

import React, { useRef, useEffect, useCallback } from "react";
import ProjectCard, { type ProjectData } from "./ProjectCard";

// ── Project Data ──────────────────────────────────────────────────────────
const projects: ProjectData[] = [
  {
    title: "Modevelle",
    description:
      "A demo e-commerce website for women's fashion, featuring product listings, cart functionality, and user authentication. Built using Next.js and the Shopify Storefront API.",
    hash: "EC4TM4BC50NS6A000",
    tags: ["NATTNS", "SHOPIFY", "STOREFRONT", "API", "GRID"],
    creditLabel: "Content Earth",
    stackImages: [
      "/site1/ina2.png",
      "/site1/ina4.png",
      "/site1/ins.png",
      "/site1/ins1.png",
      "/site1/ins3.png",
      "/site1/ins5.png",
    ],
  },
  {
    title: "Aetheria",
    description:
      "An immersive portfolio experience for creative agencies, with smooth page transitions, 3D elements, and a dynamic project showcase. Powered by Three.js and GSAP.",
    hash: "7F2BA9DC41E8F3B02",
    tags: ["THREE.JS", "GSAP", "WEBGL", "PORTFOLIO", "CMS"],
    creditLabel: "Digital Nomad",
    stackImages: ["/site2/sol1.png", "/site2/sol2.png", "/site2/sol3.png"],
  },
  {
    title: "Nocturn",
    description:
      "A real-time analytics dashboard for SaaS products, offering live metrics, custom report builders, and team collaboration features. Built with React and D3.js.",
    hash: "A91CD5E823FA07D44",
    tags: ["REACT", "D3.JS", "WEBSOCKET", "DASHBOARD", "API"],
    creditLabel: "Metric Labs",
    stackImages: ["/site3/housie1.png", "/site3/housie2.png"],
  },
  {
    title: "Verdant",
    description:
      "A sustainable marketplace connecting local artisans with conscious consumers. Features include carbon tracking, artisan profiles, and curated collections.",
    hash: "3E8F1C6DA20B94E77",
    tags: ["NEXT.JS", "STRIPE", "PRISMA", "MARKETPLACE", "ECO"],
    creditLabel: "Green Studio",
  },
];

// ── Per-card visual styles ────────────────────────────────────────────────
// Card 0 uses the last frame from Hero animation for seamless continuation.
// Each subsequent card gets a unique deep gradient.
const cardStyles: { gradient: string; backgroundImage?: string }[] = [
  {
    gradient: "linear-gradient(160deg, #0c1a2e 0%, #0f1f35 40%, #162d4a 100%)",
    backgroundImage: "/site1/ina2.png",
  },
  {
    gradient: "linear-gradient(160deg, #1e0a2e 0%, #2a1040 40%, #3d1860 100%)",
    backgroundImage: "/site2/sol1.png",
  },
  {
    gradient: "linear-gradient(160deg, #0a2e2a 0%, #0e3d38 40%, #145a52 100%)",
    backgroundImage: "/site3/housie1.png",
  },
  {
    gradient: "linear-gradient(160deg, #2e1a0a 0%, #402810 40%, #604018 100%)",
  },
];

// ── Scroll Config ─────────────────────────────────────────────────────────
const CARD_MARGIN = 16;
const VH_PER_CARD = 120; // Scroll distance per card (generous for smooth transitions)
const EXTRA_VH = 60; // Extra scroll at the end so last card can settle
const TOTAL_CARDS = projects.length;
const TOTAL_HEIGHT_VH = TOTAL_CARDS * VH_PER_CARD + EXTRA_VH;

// ── Helpers ───────────────────────────────────────────────────────────────
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

// ── Component ─────────────────────────────────────────────────────────────
const ProjectShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(SVGCircleElement | null)[]>([]);
  const rafId = useRef(0);
  const lastProgress = useRef(-1);

  const setCardRef = useCallback((el: HTMLDivElement | null, i: number) => {
    cardRefs.current[i] = el;
  }, []);

  const setProgressRef = useCallback(
    (el: SVGCircleElement | null, i: number) => {
      progressRefs.current[i] = el;
    },
    [],
  );

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      const scrolled = -rect.top;
      const range = section.offsetHeight - vh;
      const progress = clamp01(scrolled / range);

      // Skip if progress hasn't changed significantly
      if (Math.abs(progress - lastProgress.current) < 0.0005) return;
      lastProgress.current = progress;

      // ── Compute active card ───────────────────────────────────────
      let activeIdx = 0;
      for (let i = TOTAL_CARDS - 1; i >= 0; i--) {
        const cs = (i * VH_PER_CARD) / (TOTAL_CARDS * VH_PER_CARD + EXTRA_VH);
        if (progress >= cs) {
          activeIdx = i;
          break;
        }
      }

      // ── Update circular progress indicators ───────────────────────
      const circumference = 2 * Math.PI * 32;
      for (let i = 0; i < TOTAL_CARDS; i++) {
        const circle = progressRefs.current[i];
        if (!circle) continue;
        const fillFraction = (activeIdx + 1) / TOTAL_CARDS;
        const offset = circumference * (1 - fillFraction);
        circle.style.strokeDashoffset = String(offset);
      }

      // ── Update card transforms ────────────────────────────────────
      for (let i = 0; i < TOTAL_CARDS; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;

        const cardStart =
          (i * VH_PER_CARD) / (TOTAL_CARDS * VH_PER_CARD + EXTRA_VH);
        const cardPhaseLen =
          VH_PER_CARD / (TOTAL_CARDS * VH_PER_CARD + EXTRA_VH);

        // First card is always fully visible (acts as continuation of last frame)
        if (i === 0) {
          card.style.opacity = "1";
          card.style.transform = "translateY(0%) scale(1)";
          card.style.zIndex = String(i + 1);
          continue;
        }

        if (progress < cardStart) {
          // Card hasn't entered yet — hidden below
          card.style.opacity = "0";
          card.style.transform = "translateY(100%)";
          card.style.zIndex = String(i + 1);
        } else {
          // Card is entering or has entered
          const enterProgress = clamp01(
            (progress - cardStart) / (cardPhaseLen * 0.5),
          );
          const easedEnter = easeOutCubic(enterProgress);

          if (enterProgress >= 1) {
            // Fully entered — lock in place
            card.style.transform = "translateY(0%) scale(1)";
            card.style.opacity = "1";
          } else {
            // Entering: slide up from bottom, FULLY OPAQUE so card behind is hidden
            const yOffset = (1 - easedEnter) * 100;
            card.style.opacity = "1";
            card.style.transform = `translateY(${yOffset}%)`;
          }
          card.style.zIndex = String(i + 1);
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: `${TOTAL_HEIGHT_VH}vh`,
        backgroundColor: "#0a0a0a",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            padding: `${CARD_MARGIN}px`,
          }}
        >
          {projects.map((project, i) => (
            <div
              key={project.hash}
              ref={(el) => setCardRef(el, i)}
              style={{
                position: i === 0 ? "relative" : "absolute",
                top: i === 0 ? 0 : `${CARD_MARGIN}px`,
                left: i === 0 ? undefined : `${CARD_MARGIN}px`,
                right: i === 0 ? undefined : `${CARD_MARGIN}px`,
                bottom: i === 0 ? undefined : `${CARD_MARGIN}px`,
                width: i === 0 ? "100%" : undefined,
                height: i === 0 ? "100%" : undefined,
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? "none" : "translateY(100%)",
                willChange: "transform, opacity",
                zIndex: i + 1,
              }}
            >
              <ProjectCard
                project={project}
                index={i}
                total={projects.length}
                gradient={cardStyles[i]?.gradient}
                backgroundImage={cardStyles[i]?.backgroundImage}
                progressRef={(el) => setProgressRef(el, i)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;
