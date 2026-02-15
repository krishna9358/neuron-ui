"use client";

import React, { useState, useEffect } from "react";

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

interface Review {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
}

const reviewsRow1: Review[] = [
  {
    name: "Sarah Chen",
    role: "CTO",
    company: "TechVista",
    text: "NeuronUI transformed our entire product experience. The attention to detail and smooth interactions are beyond anything we expected.",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Design Lead",
    company: "Pixel Labs",
    text: "Working with NeuronUI was seamless. They understood our vision and delivered a stunning interface that our users absolutely love.",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    role: "Product Manager",
    company: "CloudSync",
    text: "The animations and micro-interactions they built are incredibly polished. Our engagement metrics went through the roof after launch.",
    rating: 5,
  },
  {
    name: "James O'Brien",
    role: "Founder",
    company: "StartupForge",
    text: "From concept to deployment, NeuronUI exceeded every expectation. The responsive design works flawlessly across all devices.",
    rating: 5,
  },
  {
    name: "Elena Volkov",
    role: "VP Engineering",
    company: "DataFlow",
    text: "Their technical expertise is matched only by their design sensibility. A rare combination that produced exceptional results for us.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Creative Director",
    company: "BrandCraft",
    text: "NeuronUI doesn't just build websites — they craft experiences. The scroll-driven animations they created are nothing short of art.",
    rating: 5,
  },
];

const reviewsRow2: Review[] = [
  {
    name: "Priya Sharma",
    role: "Head of Product",
    company: "FinEdge",
    text: "We needed a dashboard that was both powerful and beautiful. NeuronUI delivered both in spades. Our clients are consistently impressed.",
    rating: 5,
  },
  {
    name: "Tom Anderson",
    role: "CEO",
    company: "GreenPulse",
    text: "The sustainable marketplace they built for us handles thousands of transactions daily with a buttery smooth user experience.",
    rating: 5,
  },
  {
    name: "Mei Lin",
    role: "UX Researcher",
    company: "InsightLab",
    text: "User testing showed a 40% improvement in task completion rates after NeuronUI redesigned our platform. The numbers speak for themselves.",
    rating: 5,
  },
  {
    name: "Carlos Mendez",
    role: "Tech Lead",
    company: "DevMatrix",
    text: "Clean code, performant animations, and pixel-perfect design. NeuronUI is the gold standard for modern web development.",
    rating: 5,
  },
  {
    name: "Nina Johansson",
    role: "Marketing Director",
    company: "BrightWave",
    text: "Our conversion rate doubled after the redesign. NeuronUI understood our brand and translated it into an unforgettable digital experience.",
    rating: 5,
  },
  {
    name: "Raj Gupta",
    role: "Co-Founder",
    company: "NexGen AI",
    text: "They took our complex AI platform and made it approachable without sacrificing any power. Truly world-class interface design.",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? "#f59e0b" : "rgba(255,255,255,0.1)"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review, isMobile }: { review: Review; isMobile: boolean }) {
  return (
    <div
      style={{
        flex: "0 0 auto",
        width: isMobile ? "280px" : "360px",
        padding: isMobile ? "20px" : "28px",
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <StarRating count={review.rating} />
      <p
        style={{
          fontSize: isMobile ? "13px" : "14px",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.6)",
          margin: 0,
        }}
      >
        &ldquo;{review.text}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "auto" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1145A0 0%, #2563eb 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
          }}
        >
          {review.name.charAt(0)}
        </div>
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {review.name}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.5px",
            }}
          >
            {review.role}, {review.company}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollRow({
  reviews,
  direction,
  isMobile,
}: {
  reviews: Review[];
  direction: "left" | "right";
  isMobile: boolean;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const doubled = [...reviews, ...reviews];
  const gap = isMobile ? 12 : 20;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        overflow: "hidden",
        width: "100%",
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: `${gap}px`,
          width: "max-content",
          animation: `${direction === "left" ? "scrollLeft" : "scrollRight"} ${isMobile ? "25s" : "35s"} linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {doubled.map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} review={review} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

const Testimonials: React.FC = () => {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth > 0 && windowWidth < 768;

  return (
    <section
      style={{
        backgroundColor: "#0a0a0a",
        padding: isMobile ? "60px 0" : "100px 0",
        overflow: "hidden",
      }}
    >
      {/* Section Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: isMobile ? "40px" : "64px",
          padding: "0 24px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          TESTIMONIALS
        </span>
        <h2
          style={{
            fontFamily: "var(--font-serif), 'DM Serif Display', serif",
            fontSize: isMobile ? "32px" : "clamp(36px, 5vw, 56px)",
            fontWeight: 400,
            color: "#fff",
            marginTop: "16px",
            lineHeight: 1.1,
          }}
        >
          What our clients say
        </h2>
      </div>

      {/* Scrolling Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "12px" : "20px" }}>
        <ScrollRow reviews={reviewsRow1} direction="left" isMobile={isMobile} />
        <ScrollRow reviews={reviewsRow2} direction="right" isMobile={isMobile} />
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
