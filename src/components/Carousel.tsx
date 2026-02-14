"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";

const images = [
  {
    src: "/images/carousel-1.png",
    alt: "Design 1",
    label: "Make this design real",
  },
  {
    src: "/images/carousel-2.png",
    alt: "Design 2",
    label: "Make this concept real",
  },
  {
    src: "/images/carousel-3.png",
    alt: "Design 3",
    label: "Make this project real",
  },
  
];

const CARD_WIDTH = 340;
const CARD_GAP = 120;

const positionConfigs = {
  left: {
    x: -(CARD_WIDTH + CARD_GAP) * 1,
    scale: 0.82,
    rotate: -5,
    zIndex: 5,
    opacity: 0.85,
  },
  center: {
    x: 0,
    scale: 1,
    rotate: 0,
    zIndex: 15,
    opacity: 1,
  },
  right: {
    x: (CARD_WIDTH + CARD_GAP) * 1,
    scale: 0.82,
    rotate: 5,
    zIndex: 5,
    opacity: 0.85,
  },
};

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
          left: "20px",
          zIndex: 60,
          width: "40px",
          height: "40px",
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
          right: "20px",
          zIndex: 60,
          width: "40px",
          height: "40px",
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
              cursor: "pointer",
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
                  width: `${CARD_WIDTH}px`,
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
                    filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
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
                </div>

                {/* Orange selection box on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        left: "-8px",
                        right: "-8px",
                        bottom: "-8px",
                        border: "2px solid #e8622c",
                        pointerEvents: "none",
                        zIndex: 20,
                      }}
                    >
                      {[
                        { top: -5, left: -5 },
                        { top: -5, right: -5 },
                        { bottom: -5, left: -5 },
                        { bottom: -5, right: -5 },
                        { top: -5, left: "50%", transform: "translateX(-50%)" },
                        {
                          bottom: -5,
                          left: "50%",
                          transform: "translateX(-50%)",
                        },
                        { top: "50%", left: -5, transform: "translateY(-50%)" },
                        {
                          top: "50%",
                          right: -5,
                          transform: "translateY(-50%)",
                        },
                      ].map((pos, idx) => (
                        <div
                          key={idx}
                          style={
                            {
                              position: "absolute",
                              width: "8px",
                              height: "8px",
                              backgroundColor: "#fff",
                              border: "2px solid #e8622c",
                              ...pos,
                            } as React.CSSProperties
                          }
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating CTA tooltip on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: "absolute",
                        bottom: "-8px",
                        right: "16px",
                        transform: "translateY(100%)",
                        zIndex: 50,
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#2a2a2e",
                          color: "#fff",
                          padding: "10px 16px",
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span style={{ fontSize: "13px", fontWeight: 500 }}>
                          {img.label}
                        </span>
                        <div
                          style={{
                            backgroundColor: "#1145A0",
                            padding: "5px",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ArrowRight size={13} color="#fff" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
