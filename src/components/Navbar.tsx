"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Product", href: "#" },
  { name: "Solutions", href: "#" },
  { name: "Programs", href: "#" },
  { name: "Resources", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Contact", href: "#" },
];

// Animated NavLink with curly wave-in effect
function NavLink({ name, href }: { name: string; href: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      style={{
        position: "relative",
        color: isHovered ? "#fff" : "#ccc",
        fontSize: "14px",
        fontWeight: 500,
        textDecoration: "none",
        overflow: "hidden",
        display: "inline-flex",
        flexDirection: "column",
        height: "20px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Current text - slides up on hover */}
      <motion.span
        animate={{ y: isHovered ? -20 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{ display: "inline-block" }}
      >
        {name}
      </motion.span>
      {/* Duplicate text - slides up from below with wave */}
      <motion.span
        animate={{ y: isHovered ? -20 : 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          delay: 0.02,
        }}
        style={{
          display: "inline-block",
          position: "absolute",
          top: "20px",
          left: 0,
        }}
      >
        {name.split("").map((char, i) => (
          <motion.span
            key={i}
            animate={
              isHovered
                ? {
                    y: [5, -2, 0],
                    opacity: [0, 1, 1],
                  }
                : {
                    y: 0,
                    opacity: 1,
                  }
            }
            transition={{
              duration: 0.3,
              delay: i * 0.03,
              ease: "easeOut",
            }}
            style={{ display: "inline-block" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Link>
  );
}

export default function Navbar() {
  return (
    <nav
      style={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
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
        VIZCOM
      </Link>

      {/* Center Links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
        }}
      >
        {navLinks.map((link) => (
          <NavLink key={link.name} name={link.name} href={link.href} />
        ))}
      </div>

      {/* Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link
          href="#"
          style={{
            color: "#fff",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Login
        </Link>
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
          Try it out
        </Link>
      </div>
    </nav>
  );
}
