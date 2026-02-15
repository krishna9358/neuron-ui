"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const images = [
  {
    src: "/frames-01/ezgif-frame-001.jpg",
    alt: "Design 1",
  },
  {
    src: "/images/carousel-2.png",
    alt: "Design 2",
  },
  {
    src: "/images/carousel-3.png",
    alt: "Design 3",
  },
];

function getCarouselConfig(windowWidth: number) {
  if (windowWidth < 480) {
    return { cardWidth: 200, cardGap: 30, showSide: false };
  } else if (windowWidth < 768) {
    return { cardWidth: 260, cardGap: 50, showSide: true };
  } else {
    return { cardWidth: 340, cardGap: 120, showSide: true };
  }
}

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { cardWidth, cardGap, showSide } = getCarouselConfig(windowWidth);

  const positionConfigs = {
    left: {
      x: -(cardWidth + cardGap) * 1,
      scale: 0.82,
      rotate: -5,
      zIndex: 5,
      opacity: showSide ? 0.85 : 0,
    },
    center: {
      x: 0,
      scale: 1,
      rotate: 0,
      zIndex: 15,
      opacity: 1,
    },
    right: {
      x: (cardWidth + cardGap) * 1,
      scale: 0.82,
      rotate: 5,
      zIndex: 5,
      opacity: showSide ? 0.85 : 0,
    },
  };

  const nextSlide = () => setCurrentIndex((p) => (p + 1) % images.length);
  const prevSlide = () =>
    setCurrentIndex((p) => (p - 1 + images.length) % images.length);

  const getPosition = (idx: number): "left" | "center" | "right" | "hidden" => {
    const prev = (currentIndex - 1 + images.length) % images.length;
    const next = (currentIndex + 1) % images.length;
    if (idx === currentIndex) return "center";
    if (idx === prev) return "left";
    if (idx === next) return "right";
    return "hidden";
  };

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
      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        aria-label="Previous"
        style={{
          position: "absolute",
          left: windowWidth < 480 ? "4px" : "20px",
          zIndex: 60,
          width: windowWidth < 480 ? "32px" : "40px",
          height: windowWidth < 480 ? "32px" : "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.8)",
          border: "1px solid #ddd",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <ChevronLeft size={18} color="#555" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        aria-label="Next"
        style={{
          position: "absolute",
          right: windowWidth < 480 ? "4px" : "20px",
          zIndex: 60,
          width: windowWidth < 480 ? "32px" : "40px",
          height: windowWidth < 480 ? "32px" : "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.8)",
          border: "1px solid #ddd",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <ChevronRight size={18} color="#555" />
      </button>

      {/* Cards */}
      {images.map((img, i) => {
        const position = getPosition(i);
        if (position === "hidden") return null;

        const config = positionConfigs[position];
        const isCenter = position === "center";
        const isHovered = hoveredIndex === i;

        // Float params per position for organic bobbing
        const floatDuration =
          position === "left" ? 4 : position === "center" ? 3.5 : 3;
        const floatDelay =
          position === "left" ? 0 : position === "center" ? 0.5 : 1;
        const floatRange = position === "center" ? 12 : 8;

        return (
          // Positioning wrapper
          <motion.div
            key={img.src}
            animate={{
              x: config.x,
              scale: isHovered ? config.scale * 1.03 : config.scale,
              rotate: isHovered ? 0 : config.rotate,
              opacity: config.opacity,
            }}
            transition={{ type: "spring", stiffness: 250, damping: 28 }}
            style={{
              position: "absolute",
              zIndex: isHovered ? 40 : config.zIndex,
              cursor: isCenter ? "default" : "pointer",
            }}
            onClick={() => {
              // Click side cards to select them
              if (!isCenter) setCurrentIndex(i);
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Float wrapper - continuous bobbing */}
            <motion.div
              animate={{ y: [0, -floatRange, 0, floatRange * 0.5, 0] }}
              transition={{
                duration: floatDuration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: floatDelay,
              }}
            >
              {/* Card */}
              <div
                style={{
                  position: "relative",
                  width: `${cardWidth}px`,
                  aspectRatio: "16 / 10",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: isHovered
                      ? "0 20px 60px rgba(0,0,0,0.3)"
                      : "0 10px 40px rgba(0,0,0,0.15)",
                    filter: isCenter
                      ? "grayscale(0%)"
                      : isHovered
                        ? "grayscale(30%)"
                        : "grayscale(100%)",
                    transition: "filter 0.4s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="340px"
                  />

                  {/* Subtle glow ring on hover for side cards */}
                  {isHovered && !isCenter && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderRadius: "12px",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "-28px",
          display: "flex",
          gap: "8px",
          zIndex: 60,
        }}
      >
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === currentIndex ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              border: "none",
              backgroundColor:
                i === currentIndex
                  ? "rgba(0,0,0,0.6)"
                  : "rgba(0,0,0,0.15)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
