"use client";

import React, { useRef, useEffect, useCallback } from "react";
import ProjectCard, { type ProjectData } from "./ProjectCard";

const projects: ProjectData[] = [
  {
    title: "Modevelle",
    description:
      "A demo e-commerce website for women's fashion, featuring product listings, cart functionality, and user authentication. Built using Next.js and the Shopify Storefront API.",
    hash: "EC4TM4BC50NS6A000",
    tags: ["NATTNS", "SHOPIFY", "STOREFRONT", "API", "GRID"],
    creditLabel: "Content Earth",
  },
  {
    title: "Aetheria",
    description:
      "An immersive portfolio experience for creative agencies, with smooth page transitions, 3D elements, and a dynamic project showcase. Powered by Three.js and GSAP.",
    hash: "7F2BA9DC41E8F3B02",
    tags: ["THREE.JS", "GSAP", "WEBGL", "PORTFOLIO", "CMS"],
    creditLabel: "Digital Nomad",
  },
  {
    title: "Nocturn",
    description:
      "A real-time analytics dashboard for SaaS products, offering live metrics, custom report builders, and team collaboration features. Built with React and D3.js.",
    hash: "A91CD5E823FA07D44",
    tags: ["REACT", "D3.JS", "WEBSOCKET", "DASHBOARD", "API"],
    creditLabel: "Metric Labs",
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

const CARD_MARGIN = 16;
const VH_PER_CARD = 100;
const EXTRA_VH = 40;
const TOTAL_HEIGHT_VH = projects.length * VH_PER_CARD + EXTRA_VH;
const TOTAL_CARDS = projects.length;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

const ScrollStackSection: React.FC = () => {
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
    []
  );

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      if (rect.top > 0 || rect.bottom <= vh) {
        if (rect.top > 0) {
          cardRefs.current.forEach((card) => {
            if (card) {
              card.style.opacity = "0";
              card.style.transform = "translateY(100%)";
            }
          });
        }
        return;
      }

      const scrolled = -rect.top;
      const range = section.offsetHeight - vh;
      const progress = clamp01(scrolled / range);

      // Skip if progress hasn't changed significantly (perf optimization)
      if (Math.abs(progress - lastProgress.current) < 0.0005) return;
      lastProgress.current = progress;

      // Compute which card is "active" (most recent one entering)
      let activeIdx = 0;
      for (let i = TOTAL_CARDS - 1; i >= 0; i--) {
        const cs = (i * VH_PER_CARD) / (TOTAL_CARDS * VH_PER_CARD + EXTRA_VH);
        if (progress >= cs) {
          activeIdx = i;
          break;
        }
      }

      // Update circular progress indicators
      const circumference = 2 * Math.PI * 32; // matches radius in ProjectCard
      for (let i = 0; i < TOTAL_CARDS; i++) {
        const circle = progressRefs.current[i];
        if (!circle) continue;
        // Fill based on how many cards are visible (i+1 / total)
        const fillFraction = (activeIdx + 1) / TOTAL_CARDS;
        const offset = circumference * (1 - fillFraction);
        circle.style.strokeDashoffset = String(offset);
      }

      for (let i = 0; i < TOTAL_CARDS; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;

        const cardStart =
          (i * VH_PER_CARD) / (TOTAL_CARDS * VH_PER_CARD + EXTRA_VH);
        const cardPhaseLen =
          VH_PER_CARD / (TOTAL_CARDS * VH_PER_CARD + EXTRA_VH);

        if (progress < cardStart) {
          card.style.opacity = "0";
          card.style.transform = "translateY(100%)";
          card.style.zIndex = String(i + 1);
        } else {
          // Enter animation: 60% of the card phase for entrance
          const enterProgress = clamp01(
            (progress - cardStart) / (cardPhaseLen * 0.5)
          );
          const easedEnter = easeOutCubic(enterProgress);

          if (i <= activeIdx && enterProgress >= 1) {
            // Card is fully entered and may be behind active card
            if (i < activeIdx) {
              // Behind: scale down smoothly as next card enters
              const nextStart =
                ((i + 1) * VH_PER_CARD) /
                (TOTAL_CARDS * VH_PER_CARD + EXTRA_VH);
              const nextEnterProgress = clamp01(
                (progress - nextStart) / (cardPhaseLen * 0.5)
              );
              const behindCount = activeIdx - i;
              const targetScale = Math.max(0.85, 1 - behindCount * 0.05);
              const currentScale =
                1 - (1 - targetScale) * easeOutCubic(nextEnterProgress);
              card.style.transform = `scale(${currentScale})`;
              card.style.transformOrigin = "center top";
              card.style.opacity = String(
                Math.max(0.6, 1 - behindCount * 0.12)
              );
            } else {
              // Active card: full size
              card.style.transform = "translateY(0%) scale(1)";
              card.style.opacity = "1";
            }
          } else {
            // Entering: slide up from below
            const yOffset = (1 - easedEnter) * 100;
            card.style.opacity = String(Math.min(1, easedEnter * 2));
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
                progressRef={(el) => setProgressRef(el, i)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollStackSection;
