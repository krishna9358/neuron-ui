"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// ── Helpers ──────────────────────────────────────────────────────────
function clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
}
function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}
function easeOutCubic(t: number) {
    return 1 - (1 - t) ** 3;
}

// ── Config ───────────────────────────────────────────────────────────
const SECTION_HEIGHT_VH = 380;

// ── Cursor SVG ───────────────────────────────────────────────────────
const CursorArrow: React.FC<{ color: string }> = ({ color }) => (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
        <path
            d="M1 1L1 17.5L5.5 13L9.5 20L12 18.5L8 12L14 12L1 1Z"
            fill={color}
        />
    </svg>
);

// ── Cursor with label + bounce ───────────────────────────────────────
const CursorWithLabel: React.FC<{
    name: string;
    color: string;
    cursorRef: React.Ref<HTMLDivElement>;
    assembled: boolean;
    bounceDelay: number;
    bx?: number[];
    by?: number[];
}> = ({ name, color, cursorRef, assembled, bounceDelay, bx, by }) => (
    <div
        ref={cursorRef}
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 20,
            pointerEvents: "none",
            willChange: "transform, opacity",
            opacity: 0,
        }}
    >
        <motion.div
            animate={
                assembled
                    ? { x: bx || [0, 4, -3, 2, 0], y: by || [0, -5, 3, -2, 0] }
                    : { x: 0, y: 0 }
            }
            transition={
                assembled
                    ? {
                        duration: 3.5,
                        repeat: Infinity,
                        repeatType: "loop" as const,
                        ease: "easeInOut",
                        delay: bounceDelay,
                    }
                    : { duration: 0.1 }
            }
            style={{
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "flex-start",
            }}
        >
            <CursorArrow color={color} />
            <div
                style={{
                    backgroundColor: color,
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                    marginTop: "-4px",
                    marginLeft: "14px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    letterSpacing: "0.3px",
                }}
            >
                {name}
            </div>
        </motion.div>
    </div>
);

// ── Grid Background ──────────────────────────────────────────────────
const GridBackground: React.FC<{ gridRef: React.Ref<HTMLDivElement> }> = ({
    gridRef,
}) => (
    <div
        ref={gridRef}
        style={{
            position: "absolute",
            top: "18%",
            left: "25%",
            width: "50%",
            height: "38%",
            zIndex: 1,
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity 0.8s ease",
        }}
    >
        {/* Horizontal + vertical lines */}
        <div
            style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `
          linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
        `,
                backgroundSize: "48px 48px",
            }}
        />
        {/* Dots at intersections */}
        <div
            style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                backgroundSize: "48px 48px",
                backgroundPosition: "0 0",
            }}
        />
    </div>
);

// ── Main Component ───────────────────────────────────────────────────
const BuiltForTeams: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Text refs
    const buRef = useRef<HTMLSpanElement>(null);
    const iRef = useRef<HTMLSpanElement>(null);
    const lRef = useRef<HTMLSpanElement>(null);
    const tRef = useRef<HTMLSpanElement>(null);
    const forRef = useRef<HTMLSpanElement>(null);
    const teRef = useRef<HTMLSpanElement>(null);
    const amRef = useRef<HTMLSpanElement>(null);
    const sRef = useRef<HTMLSpanElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // Cursor refs
    const jordanRef = useRef<HTMLDivElement>(null);
    const jesseRef = useRef<HTMLDivElement>(null);
    const edenRef = useRef<HTMLDivElement>(null);
    const brookeRef = useRef<HTMLDivElement>(null);

    const [assembled, setAssembled] = useState(false);
    const assembledRef = useRef(false);

    useEffect(() => {
        const update = () => {
            const section = sectionRef.current;
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const vw = window.innerWidth;

            if (rect.top > 0) {
                // Reset
                [buRef, iRef, lRef, tRef, forRef, teRef, amRef, sRef].forEach((r) => {
                    if (r.current) r.current.style.opacity = "0";
                });
                if (subtitleRef.current) subtitleRef.current.style.opacity = "0";
                if (gridRef.current) gridRef.current.style.opacity = "0";
                [jordanRef, jesseRef, edenRef, brookeRef].forEach((r) => {
                    if (r.current) r.current.style.opacity = "0";
                });
                return;
            }
            if (rect.bottom <= vh) return;

            const scrolled = -rect.top;
            const range = section.offsetHeight - vh;
            const p = clamp01(scrolled / range);

            const isMobile = vw < 768;

            // ── Center positions for cursors ──
            const cx = vw / 2;
            const cy = vh * 0.32;
            const textHalf = isMobile ? vw * 0.32 : Math.min(vw * 0.24, 300);

            // ── Grid ──
            if (gridRef.current) {
                gridRef.current.style.opacity = String(clamp01((p - 0.05) / 0.15));
            }

            // ── "Bu" ──
            const buP = clamp01((p - 0.03) / 0.04);
            if (buRef.current) buRef.current.style.opacity = String(buP);

            // ── "i", "l", "t" (typewriter) ──
            const iP = clamp01((p - 0.09) / 0.03);
            if (iRef.current) iRef.current.style.opacity = String(iP);
            const lP = clamp01((p - 0.13) / 0.03);
            if (lRef.current) lRef.current.style.opacity = String(lP);
            const tP = clamp01((p - 0.17) / 0.03);
            if (tRef.current) tRef.current.style.opacity = String(tP);

            // ── Jordan cursor (appears with "Bu", stays near "Built") ──
            if (jordanRef.current) {
                const jVisible = p > 0.02;
                const jx = cx - textHalf - (isMobile ? 10 : 20);
                const jy = cy + 10;
                jordanRef.current.style.opacity = jVisible ? "1" : "0";
                jordanRef.current.style.transform = `translate(${jx}px, ${jy}px)`;
            }

            // ── "for" from top (Jesse drags) ──
            const forP = easeOutCubic(clamp01((p - 0.24) / 0.12));
            if (forRef.current) {
                const y = lerp(-140, 0, forP);
                forRef.current.style.opacity = String(
                    forP > 0.01 ? Math.min(1, forP * 1.5) : 0
                );
                forRef.current.style.transform = `translateY(${y}px)`;
            }
            if (jesseRef.current) {
                const jVisible = p > 0.20;
                const jx = cx + (isMobile ? 20 : 80);
                const jy = cy - (isMobile ? 50 : 70) + lerp(-140, 0, forP);
                jesseRef.current.style.opacity = jVisible ? "1" : "0";
                jesseRef.current.style.transform = `translate(${jx}px, ${jy}px)`;
            }

            // ── "te" from right (Eden drags) ──
            const teP = easeOutCubic(clamp01((p - 0.40) / 0.12));
            if (teRef.current) {
                const x = lerp(isMobile ? 120 : 220, 0, teP);
                teRef.current.style.opacity = String(
                    teP > 0.01 ? Math.min(1, teP * 1.5) : 0
                );
                teRef.current.style.transform = `translateX(${x}px)`;
            }
            if (edenRef.current) {
                const eVisible = p > 0.36;
                // Cap so it doesn't overflow the viewport
                const edenRestX = Math.min(cx + textHalf + 20 + lerp(isMobile ? 120 : 220, 0, teP), vw - 80);
                const ey = cy + 30;
                edenRef.current.style.opacity = eVisible ? "1" : "0";
                edenRef.current.style.transform = `translate(${edenRestX}px, ${ey}px)`;
            }

            // ── "am" from bottom (Brooke drags) ──
            const amP = easeOutCubic(clamp01((p - 0.55) / 0.12));
            if (amRef.current) {
                const y = lerp(120, 0, amP);
                amRef.current.style.opacity = String(
                    amP > 0.01 ? Math.min(1, amP * 1.5) : 0
                );
                amRef.current.style.transform = `translateY(${y}px)`;
            }
            if (brookeRef.current) {
                const bVisible = p > 0.50;
                const bx = cx - (isMobile ? 40 : 60);
                const by = cy + (isMobile ? 60 : 90) + lerp(120, 0, amP);
                brookeRef.current.style.opacity = bVisible ? "1" : "0";
                brookeRef.current.style.transform = `translate(${bx}px, ${by}px)`;
            }

            // ── "s" ──
            const sP = clamp01((p - 0.68) / 0.03);
            if (sRef.current) sRef.current.style.opacity = String(sP);

            // ── Subtitle ──
            const subP = easeOutCubic(clamp01((p - 0.73) / 0.07));
            if (subtitleRef.current) {
                subtitleRef.current.style.opacity = String(subP);
                subtitleRef.current.style.transform = `translateY(${lerp(20, 0, subP)}px)`;
            }

            // ── Assembled toggle ──
            const isAssembled = p >= 0.72;
            if (isAssembled !== assembledRef.current) {
                assembledRef.current = isAssembled;
                setAssembled(isAssembled);
            }
        };

        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        update();
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    const spanBase: React.CSSProperties = {
        display: "inline-block",
        opacity: 0,
        willChange: "transform, opacity",
    };

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
                style={{
                    position: "sticky",
                    top: 0,
                    width: "100%",
                    height: "100vh",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: "12vh",
                    backgroundColor: "#0a0a0a",
                }}
            >
                {/* Grid background */}
                <GridBackground gridRef={gridRef} />

                {/* ── Title ── */}
                <h2
                    style={{
                        position: "relative",
                        zIndex: 5,
                        fontSize: "clamp(42px, 8vw, 96px)",
                        color: "#fff",
                        textAlign: "center",
                        lineHeight: 1.05,
                        margin: 0,
                        padding: "0 16px",
                        whiteSpace: "nowrap",
                    }}
                >
                    {/* "Built" in script font */}
                    <span
                        style={{
                            fontFamily: "var(--font-title), cursive",
                            fontStyle: "italic",
                        }}
                    >
                        <span ref={buRef} style={spanBase}>
                            Bu
                        </span>
                        <span ref={iRef} style={spanBase}>
                            i
                        </span>
                        <span ref={lRef} style={spanBase}>
                            l
                        </span>
                        <span ref={tRef} style={spanBase}>
                            t
                        </span>
                    </span>{" "}
                    {/* "for" */}
                    <span
                        ref={forRef}
                        style={{
                            ...spanBase,
                            fontFamily: "var(--font-title), cursive",
                            fontWeight: 300,
                            fontStyle: "italic",
                        }}
                    >
                        for
                    </span>{" "}
                    {/* "teams" */}
                    <span
                        style={{
                            fontFamily: "var(--font-title), cursive",
                            fontStyle: "italic",
                        }}
                    >
                        <span ref={teRef} style={spanBase}>
                            te
                        </span>
                        <span ref={amRef} style={spanBase}>
                            am
                        </span>
                        <span ref={sRef} style={spanBase}>
                            s
                        </span>
                    </span>
                </h2>

                {/* ── Subtitle ── */}
                <div
                    ref={subtitleRef}
                    style={{
                        position: "relative",
                        zIndex: 5,
                        opacity: 0,
                        marginTop: "24px",
                        willChange: "transform, opacity",
                    }}
                >
                    <p
                        style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "clamp(14px, 2.5vw, 18px)",
                            fontWeight: 400,
                            letterSpacing: "0.3px",
                            textAlign: "center",
                            margin: 0,
                            padding: "0 16px",
                        }}
                    >
                        Stay aligned, move faster, and build together
                    </p>
                </div>


                {/* ── Cursors ── */}
                <CursorWithLabel
                    name="Jordan"
                    color="#c67a2e"
                    cursorRef={jordanRef}
                    assembled={assembled}
                    bounceDelay={0}
                    bx={[0, 3, -2, 4, 0]}
                    by={[0, -4, 2, -1, 0]}
                />
                <CursorWithLabel
                    name="Jesse"
                    color="#4a7dff"
                    cursorRef={jesseRef}
                    assembled={assembled}
                    bounceDelay={0.5}
                    bx={[0, -2, 3, -1, 0]}
                    by={[0, -3, 1, -4, 0]}
                />
                <CursorWithLabel
                    name="Eden"
                    color="#c480b8"
                    cursorRef={edenRef}
                    assembled={assembled}
                    bounceDelay={1.0}
                    bx={[0, 2, -3, 1, 0]}
                    by={[0, 3, -2, 4, 0]}
                />
                <CursorWithLabel
                    name="Brooke"
                    color="#6b7a3a"
                    cursorRef={brookeRef}
                    assembled={assembled}
                    bounceDelay={1.5}
                    bx={[0, -3, 2, -1, 0]}
                    by={[0, 2, -3, 1, 0]}
                />
            </div>

            {/* ── Cal.com embed ── */}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    padding: "0 16px 40px",
                    backgroundColor: "#0a0a0a",
                }}
            >
                <iframe
                    src="https://cal.com/neuronui/30min?embed&theme=dark&layout=month_view"
                    style={{
                        width: "100%",
                        maxWidth: "1000px",
                        height: "min(600px, 70vh)",
                        minHeight: "350px",
                        border: "none",
                        borderRadius: "16px",
                        colorScheme: "dark",
                    }}
                    loading="lazy"
                    allow="payment"
                />
            </div>
        </section>
    );
};

export default BuiltForTeams;
