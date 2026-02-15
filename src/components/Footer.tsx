"use client";

import React, { useState, useEffect } from "react";
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

// ── Wavy hover link (per-character wave, matching Navbar) ─────────────────
const WavyText: React.FC<{
    text: string;
    href?: string;
    onClick?: () => void;
    fontSize?: string;
}> = ({ text, href, onClick, fontSize = "11px" }) => {
    const [isHovered, setIsHovered] = useState(false);
    const characters = text.split("");
    const height = parseInt(fontSize) + 4;

    const content = (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                height: `${height}px`,
                overflow: "hidden",
                cursor: "pointer",
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
                        height: `${height}px`,
                        width: char === " " ? "4px" : undefined,
                    }}
                >
                    <motion.span
                        animate={{ y: isHovered ? -height : 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            delay: i * 0.02,
                        }}
                        style={{
                            display: "block",
                            lineHeight: `${height}px`,
                            fontSize,
                            fontWeight: 500,
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            color: isHovered ? "#fff" : "rgba(255,255,255,0.5)",
                        }}
                    >
                        <span style={{ display: "block", height: `${height}px` }}>
                            {char === " " ? "\u00A0" : char}
                        </span>
                        <span style={{ display: "block", height: `${height}px` }}>
                            {char === " " ? "\u00A0" : char}
                        </span>
                    </motion.span>
                </span>
            ))}
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
                {content}
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
            {content}
        </button>
    );
};

// ── Live IST Clock ────────────────────────────────────────────────────────
const LiveClock: React.FC = () => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const ist = new Date(
                now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
            );
            const h = String(ist.getHours()).padStart(2, "0");
            const m = String(ist.getMinutes()).padStart(2, "0");
            const s = String(ist.getSeconds()).padStart(2, "0");
            setTime(`${h}:${m}:${s}`);
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span
            style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                fontVariantNumeric: "tabular-nums",
                fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
            }}
        >
            IST — {time}
        </span>
    );
};

// ── Footer Component ──────────────────────────────────────────────────────
const Footer: React.FC = () => {
    const handleBackToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth > 0 && windowWidth < 768;

    return (
        <footer
            style={{
                position: "relative",
                backgroundColor: "#0a0a0a",
                color: "#fff",
                overflow: "hidden",
            }}
        >
            {/* ── Top info row ──────────────────────────────────────────────── */}
            <div
                style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    padding: isMobile ? "32px 20px" : "40px 48px",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                    gap: isMobile ? "32px" : "24px",
                }}
            >
                {/* Left column: Contact + Socials */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                    }}
                >
                    <WavyText text="hello@neuronui.com" href="mailto:hello@neuronui.com" />
                    <div style={{ height: "8px" }} />
                    <WavyText text="Instagram" href="https://instagram.com" />
                    <WavyText text="LinkedIn" href="https://linkedin.com" />
                </div>

                {/* Center column: Time + Actions */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                    }}
                >
                    <LiveClock />
                    <div style={{ height: "8px" }} />
                    <WavyText text="Back to Top" onClick={handleBackToTop} />
                </div>

                {/* Right column: Credits */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isMobile ? "flex-start" : "flex-end",
                        gap: "10px",
                    }}
                >
                    <span
                        style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.5)",
                        }}
                    >
                        DESIGNED BY{" "}
                        <a
                            href="#"
                            style={{
                                color: "rgba(255,255,255,0.75)",
                                textDecoration: "underline",
                                textUnderlineOffset: "3px",
                                textDecorationColor: "rgba(255,255,255,0.2)",
                            }}
                        >
                            NEURONUI
                        </a>
                    </span>
                </div>
            </div>

            {/* ── Giant Brand Name ──────────────────────────────────────────── */}
            {/* <div
                style={{
                    padding: "40px 48px 60px",
                    overflow: "hidden",
                }}
            >
                <h2
                    style={{
                        fontFamily: "var(--font-serif), 'DM Serif Display', serif",
                        fontSize: "clamp(80px, 14vw, 220px)",
                        fontWeight: 400,
                        lineHeight: 0.9,
                        letterSpacing: "-2px",
                        color: "#fff",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        margin: 0,
                        userSelect: "none",
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            fontWeight: 300,
                            marginRight: "0.15em",
                            opacity: 0.9,
                        }}
                    >
                        ||
                    </span>
                    NeuronUI
                    <span
                        style={{
                            display: "inline-block",
                            fontWeight: 300,
                            marginLeft: "0.15em",
                            opacity: 0.9,
                        }}
                    >
                        ||
                    </span>
                </h2>
            </div> */}

            {/* ── Bottom bar ────────────────────────────────────────────────── */}
            <div
                style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    padding: isMobile ? "16px 20px" : "16px 48px",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? "8px" : "0",
                }}
            >
                <span
                    style={{
                        fontSize: "10px",
                        letterSpacing: "1.5px",
                        color: "rgba(255,255,255,0.25)",
                        textTransform: "uppercase",
                    }}
                >
                    © {new Date().getFullYear()} NeuronUI. All rights reserved.
                </span>
                <span
                    style={{
                        fontSize: "10px",
                        letterSpacing: "1.5px",
                        color: "rgba(255,255,255,0.25)",
                        textTransform: "uppercase",
                    }}
                >
                    Made with ♥ in India
                </span>
            </div>
        </footer>
    );
};

export default Footer;
