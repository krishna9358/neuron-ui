"use client";

import React, { memo } from "react";
import ProjectCard, { type ProjectData } from "./ProjectCard";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";

const projects: ProjectData[] = [
  {
    title: "Modevelle",
    description:
      "A demo e-commerce website for women's fashion, featuring product listings, cart functionality, and user authentication. Built using Next.js and the Shopify Storefront API.",
    hash: "EC4TM4BC50NS6A000",
    tags: ["NEXTJS", "SHOPIFY STOREFRONT API", "GSAP"],
    creditLabel: "Content Earth",
    category: "ECOMMERCE WEBSITE",
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
    tags: ["THREE.JS", "GSAP", "WEBGL"],
    creditLabel: "Digital Nomad",
    category: "PORTFOLIO EXPERIENCE",
    stackImages: ["/site2/sol1.png", "/site2/sol2.png", "/site2/sol3.png"],
  },
  {
    title: "Nocturn",
    description:
      "A real-time analytics dashboard for SaaS products, offering live metrics, custom report builders, and team collaboration features. Built with React and D3.js.",
    hash: "A91CD5E823FA07D44",
    tags: ["REACT", "D3.JS", "WEBSOCKET"],
    creditLabel: "Metric Labs",
    category: "ANALYTICS DASHBOARD",
    stackImages: ["/site3/housie1.png", "/site3/housie2.png"],
  },
  {
    title: "Verdant",
    description:
      "A sustainable marketplace connecting local artisans with conscious consumers. Features include carbon tracking, artisan profiles, and curated collections.",
    hash: "3E8F1C6DA20B94E77",
    tags: ["NEXT.JS", "STRIPE", "PRISMA"],
    creditLabel: "Green Studio",
    category: "SUSTAINABLE MARKETPLACE",
  },
];

// ── Per-card glassmorphism gradients ──
const cardGradients = [
  "linear-gradient(160deg, rgba(12,26,46,0.75) 0%, rgba(15,31,53,0.7) 40%, rgba(22,45,74,0.65) 100%)",
  "linear-gradient(160deg, rgba(30,10,46,0.75) 0%, rgba(42,16,64,0.7) 40%, rgba(61,24,96,0.65) 100%)",
  "linear-gradient(160deg, rgba(10,46,42,0.75) 0%, rgba(14,61,56,0.7) 40%, rgba(20,90,82,0.65) 100%)",
  "linear-gradient(160deg, rgba(46,26,10,0.75) 0%, rgba(64,40,16,0.7) 40%, rgba(96,64,24,0.65) 100%)",
];

// ── Per-card background images ──
const cardBackgroundImages = [
  "/site1/blurredIns.png",
  "/site2/blurredSol.png",
  "/site3/blurredHousie1.png",
  "/site1/blurredIns.png",
];

// Performance: Memoize the entire section. The project data is static,
// so this component should never re-render unless its parent forces it.
const ScrollStackSection: React.FC = memo(() => {
  return (
    <section
      className="relative w-full bg-[#0a0a0a]"
      style={
        {
          // No min-height needed here — ScrollStack controls its own height
          // via (cardCount + 1) * 100vh.
          // The section just wraps and provides background color.
        }
      }
    >
      <ScrollStack useWindowScroll={true}>
        {projects.map((project, i) => (
          <ScrollStackItem
            key={project.hash}
            itemClassName="w-full h-full !p-0 !rounded-[20px] !shadow-none !bg-transparent"
          >
            <div className="w-full h-full rounded-[20px] overflow-hidden">
              <ProjectCard
                project={project}
                index={i}
                total={projects.length}
                gradient={cardGradients[i]}
                backgroundImage={cardBackgroundImages[i]}
              />
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
});

ScrollStackSection.displayName = "ScrollStackSection";

export default ScrollStackSection;
