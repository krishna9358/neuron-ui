"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Projects", href: "#" },
  { name: "About us", href: "#" },
  { name: "Features", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Testimonials", href: "#" },
];

// -----------------------------------------------------------------------------
// Animated NavLink with loop/wave effect (per-character split)
// -----------------------------------------------------------------------------
function NavLink({
  name,
  href,
  isMobile = false,
}: {
  name: string;
  href: string;
  isMobile?: boolean; // Prop to adjust for mobile sizing
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = name.split("");

  return (
    <Link
      href={href}
      style={{
        position: "relative",
        color: isHovered ? "#fff" : "#ccc",
        fontSize: isMobile ? "24px" : "14px", // Bigger font on mobile
        fontWeight: isMobile ? 600 : 500,
        textDecoration: "none",
        display: "inline-flex",
        height: isMobile ? "32px" : "20px", // Taller on mobile
        alignItems: "center",
        justifyContent: isMobile ? "center" : "flex-start",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {characters.map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            height: isMobile ? "32px" : "20px",
            // preserve whitespace width for spaces
            width: char === " " ? (isMobile ? "6px" : "4px") : undefined,
          }}
        >
          {/* Both copies move together — no desync */}
          <motion.span
            animate={{ y: isHovered ? (isMobile ? -32 : -20) : 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: i * 0.025,
            }}
            style={{
              display: "block",
              lineHeight: isMobile ? "32px" : "20px",
            }}
          >
            {/* Current character */}
            <span
              style={{ display: "block", height: isMobile ? "32px" : "20px" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
            {/* Duplicate character */}
            <span
              style={{ display: "block", height: isMobile ? "32px" : "20px" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          </motion.span>
        </span>
      ))}
    </Link>
  );
}

// -----------------------------------------------------------------------------
// Hamburger Icon Component
// -----------------------------------------------------------------------------
function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        animate={isOpen ? { d: "M18 6L6 18" } : { d: "M4 6h16" }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        animate={isOpen ? { opacity: 0 } : { opacity: 1, d: "M4 12h16" }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        animate={isOpen ? { d: "M6 6l12 12" } : { d: "M4 18h16" }}
        transition={{ duration: 0.3 }}
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Navbar Component — hides with animation when frames start in Hero
// -----------------------------------------------------------------------------
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Handle Resize for Responsive Layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setIsOpen(false); // Close menu on resize to desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen for custom event to hide navbar when Hero frames start
  useEffect(() => {
    const handleHide = () => setIsHidden(true);
    const handleShow = () => setIsHidden(false);

    window.addEventListener("navbar:hide", handleHide);
    window.addEventListener("navbar:show", handleShow);

    return () => {
      window.removeEventListener("navbar:hide", handleHide);
      window.removeEventListener("navbar:show", handleShow);
    };
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: 0, x: "-50%", opacity: 1 }}
        animate={{
          y: isHidden ? -100 : 0,
          x: "-50%",
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          zIndex: 100,
          width: "92%",
          maxWidth: "900px",
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          pointerEvents: isHidden ? "none" : "auto",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "18px",
            letterSpacing: "-0.5px",
            textDecoration: "none",
          }}
        >
          NeuronUI
        </Link>

        {/* Desktop Links & Actions */}
        {!isMobile && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
              {navLinks.map((link) => (
                <NavLink key={link.name} name={link.name} href={link.href} />
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Link
                href="#"
                style={{
                  backgroundColor: "#1145A0",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  padding: "8px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0d3680")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1145A0")
                }
              >
                Book a Demo
              </Link>
            </div>
          </>
        )}

        {/* Mobile Hamburger Toggle */}
        {isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              zIndex: 101, // Ensure it's clickable
            }}
          >
            <HamburgerIcon isOpen={isOpen} />
          </button>
        )}
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -20, scale: 0.95, x: "-50%" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: "80px",
              left: "50%",
              width: "90%", // Slightly smaller than nav
              maxWidth: "400px",
              backgroundColor: "rgba(26, 26, 26, 0.95)", // Re-added transparency for backdrop filter effect
              backdropFilter: "blur(12px)",
              borderRadius: "16px",
              padding: "32px 20px",
              zIndex: 99,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                name={link.name}
                href={link.href}
                isMobile={true}
              />
            ))}

            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "rgba(255,255,255,0.1)",
                margin: "10px 0",
              }}
            />

            <Link
              href="#"
              style={{
                backgroundColor: "#1145A0",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 600,
                padding: "12px 0",
                width: "100%",
                textAlign: "center",
                borderRadius: "10px",
                textDecoration: "none",
              }}
            >
              Book a Demo
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
