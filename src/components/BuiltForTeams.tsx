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
function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

// Quadratic bezier — single control point for arced text paths
function qBez(a: number, cp: number, b: number, t: number) {
    const mt = 1 - t;
    return mt * mt * a + 2 * mt * t * cp + t * t * b;
}

// Cubic bezier — two control points for complex cursor approach curves
function cBez(a: number, c1: number, c2: number, b: number, t: number) {
    const mt = 1 - t;
    return mt * mt * mt * a + 3 * mt * mt * t * c1 + 3 * mt * t * t * c2 + t * t * t * b;
}

// ── Config ───────────────────────────────────────────────────────────
const SECTION_HEIGHT_VH = 500;

// Phase boundaries (fraction of total scroll range)
const TEXT_END = 0.56; // text animation finishes at 56% of total scroll
const CAL_START = 0.62; // cal transition begins at 62%
const CAL_END = 0.90; // cal transition ends at 90%

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

    // Cal transition refs
    const titleGroupRef = useRef<HTMLDivElement>(null);
    const calRef = useRef<HTMLDivElement>(null);

    const [assembled, setAssembled] = useState(false);
    const assembledRef = useRef(false);

    useEffect(() => {
        let smoothTotal = -1;
        let rafId = 0;
        let isVisible = false;

        // Pause RAF when section is far off-screen
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible && !rafId) {
                    rafId = requestAnimationFrame(tick);
                }
            },
            { rootMargin: "200px" }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);

        const tick = () => {
            if (!isVisible) {
                rafId = 0;
                return;
            }

            const section = sectionRef.current;
            if (!section) {
                rafId = requestAnimationFrame(tick);
                return;
            }

            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const vw = window.innerWidth;

            // ── Raw scroll progress ──
            const scrolled = -rect.top;
            const totalRange = section.offsetHeight - vh;
            const rawTotal = scrolled / totalRange;

            // ── Smooth interpolation for buttery movement ──
            if (smoothTotal < 0) smoothTotal = rawTotal;
            else smoothTotal += (rawTotal - smoothTotal) * 0.08;

            const totalP = clamp01(smoothTotal);
            const isMobile = vw < 768;

            // ── BEFORE SECTION ──
            if (rawTotal < -0.005) {
                [buRef, iRef, lRef, tRef, forRef, teRef, amRef, sRef].forEach(
                    (r) => {
                        if (r.current) r.current.style.opacity = "0";
                    }
                );
                if (subtitleRef.current) subtitleRef.current.style.opacity = "0";
                if (gridRef.current) gridRef.current.style.opacity = "0";
                [jordanRef, jesseRef, edenRef, brookeRef].forEach((r) => {
                    if (r.current) r.current.style.opacity = "0";
                });
                if (titleGroupRef.current)
                    titleGroupRef.current.style.transform = "none";
                if (calRef.current) {
                    calRef.current.style.opacity = "0";
                    calRef.current.style.transform = "translateY(60px)";
                }
                rafId = requestAnimationFrame(tick);
                return;
            }

            // ── AFTER SECTION ──
            if (rawTotal > 1.005) {
                [buRef, iRef, lRef, tRef].forEach((r) => {
                    if (r.current) r.current.style.opacity = "1";
                });
                if (forRef.current) {
                    forRef.current.style.opacity = "1";
                    forRef.current.style.transform = "none";
                }
                [teRef, amRef, sRef].forEach((r) => {
                    if (r.current) {
                        r.current.style.opacity = "1";
                        r.current.style.transform = "translate(0px, 0px)";
                    }
                });
                if (subtitleRef.current) {
                    subtitleRef.current.style.opacity = "1";
                    subtitleRef.current.style.transform = "translateY(0)";
                }
                if (gridRef.current) gridRef.current.style.opacity = "0";
                [jordanRef, jesseRef, edenRef, brookeRef].forEach((r) => {
                    if (r.current) r.current.style.opacity = "0";
                });
                if (titleGroupRef.current) {
                    titleGroupRef.current.style.transform = `translateY(${-(vh * 0.22)}px) scale(0.55)`;
                }
                if (calRef.current) {
                    calRef.current.style.opacity = "1";
                    calRef.current.style.transform = "translateY(0)";
                }
                rafId = requestAnimationFrame(tick);
                return;
            }

            // ── PINNED ──
            const p = clamp01(totalP / TEXT_END);
            const calP = easeOutCubic(
                clamp01((totalP - CAL_START) / (CAL_END - CAL_START))
            );
            const settleP = easeOutCubic(clamp01((p - 0.78) / 0.15));

            const cx = vw / 2;
            const cy = vh * 0.32;
            const textHalf = isMobile
                ? vw * 0.32
                : Math.min(vw * 0.24, 300);

            const cursorFade = 1 - calP;
            const CURSOR_APPEAR = 0.01;

            // ── Grid ──
            if (gridRef.current) {
                const gridBase = clamp01((p - 0.05) / 0.15);
                gridRef.current.style.opacity = String(gridBase * cursorFade);
            }

            // ════════════════════════════════════════════════════════════
            // TEXT ANIMATIONS
            // ════════════════════════════════════════════════════════════

            // "Bu", "i", "l", "t" — typewriter (typed by Jordan)
            const buP = clamp01((p - 0.03) / 0.04);
            if (buRef.current) buRef.current.style.opacity = String(buP);
            const iP = clamp01((p - 0.09) / 0.03);
            if (iRef.current) iRef.current.style.opacity = String(iP);
            const lP = clamp01((p - 0.13) / 0.03);
            if (lRef.current) lRef.current.style.opacity = String(lP);
            const tP = clamp01((p - 0.17) / 0.03);
            if (tRef.current) tRef.current.style.opacity = String(tP);

            // "for" — typed by Jordan (fade in)
            const forP = clamp01((p - 0.22) / 0.06);
            if (forRef.current) {
                forRef.current.style.opacity = String(forP);
                forRef.current.style.transform = "none";
            }

            // ── "te" — curvy arc from upper-right (dragged by Jesse) ──
            const teRaw = clamp01((p - 0.32) / 0.12);
            const teE = easeOutCubic(teRaw);
            const teX = qBez(isMobile ? 120 : 220, isMobile ? 20 : 50, 0, teE);
            const teY = qBez(isMobile ? -40 : -70, isMobile ? 30 : 45, 0, teE);
            if (teRef.current) {
                teRef.current.style.opacity = String(
                    teRaw > 0.01 ? Math.min(1, teRaw * 1.5) : 0
                );
                teRef.current.style.transform = `translate(${teX}px, ${teY}px)`;
            }

            // ── "am" — curvy arc from lower-left (dragged by Brooke) ──
            const amRaw = clamp01((p - 0.48) / 0.12);
            const amE = easeOutCubic(amRaw);
            const amX = qBez(isMobile ? -30 : -50, isMobile ? 25 : 40, 0, amE);
            const amY = qBez(isMobile ? 100 : 140, isMobile ? 20 : 30, 0, amE);
            if (amRef.current) {
                amRef.current.style.opacity = String(
                    amRaw > 0.01 ? Math.min(1, amRaw * 1.5) : 0
                );
                amRef.current.style.transform = `translate(${amX}px, ${amY}px)`;
            }

            // ── "s" — curvy arc from bottom-right (dragged by Eden) ──
            const sRaw = clamp01((p - 0.62) / 0.1);
            const sE = easeOutCubic(sRaw);
            const sX = qBez(isMobile ? 80 : 160, isMobile ? -15 : -30, 0, sE);
            const sY = qBez(isMobile ? 70 : 110, isMobile ? 35 : 50, 0, sE);
            if (sRef.current) {
                sRef.current.style.opacity = String(
                    sRaw > 0.01 ? Math.min(1, sRaw * 1.5) : 0
                );
                sRef.current.style.transform = `translate(${sX}px, ${sY}px)`;
            }

            // ════════════════════════════════════════════════════════════
            // CURSOR ANIMATIONS — ALL VISIBLE & MOVING SIMULTANEOUSLY
            // ════════════════════════════════════════════════════════════

            // ── Jordan: types "Built for" ──
            if (jordanRef.current) {
                const visible = p > CURSOR_APPEAR;
                let jx: number, jy: number;

                const JORDAN_APPROACH = 0.05;
                const typingStartX = cx - textHalf + (isMobile ? 20 : 30);
                const typingEndX = cx + (isMobile ? 0 : 10);
                const typingP = clamp01(
                    (p - JORDAN_APPROACH) / (0.28 - JORDAN_APPROACH)
                );

                if (p < JORDAN_APPROACH) {
                    // Curved approach from far left
                    const aP = easeInOutCubic(
                        clamp01(
                            (p - CURSOR_APPEAR) /
                                (JORDAN_APPROACH - CURSOR_APPEAR)
                        )
                    );
                    jx = cBez(
                        cx - textHalf - (isMobile ? 100 : 180),
                        cx - textHalf - (isMobile ? 60 : 120),
                        cx - textHalf - (isMobile ? 10 : 20),
                        typingStartX,
                        aP
                    );
                    jy = cBez(
                        cy + (isMobile ? 50 : 80),
                        cy - (isMobile ? 20 : 40),
                        cy + 25,
                        cy + 15,
                        aP
                    );
                } else {
                    // Typing: follows text left→right
                    const jxActive = lerp(typingStartX, typingEndX, typingP);
                    const jyActive = cy + 15;
                    const jxSettled = cx - textHalf - (isMobile ? 30 : 55);
                    const jySettled = cy - 15;
                    jx = lerp(jxActive, jxSettled, settleP);
                    jy = lerp(jyActive, jySettled, settleP);
                }

                jordanRef.current.style.opacity = String(
                    (visible ? 1 : 0) * cursorFade
                );
                jordanRef.current.style.transform = `translate(${jx}px, ${jy}px)`;
            }

            // ── Jesse: approaches from right, drags "te" ──
            if (jesseRef.current) {
                const visible = p > CURSOR_APPEAR;
                let jx: number, jy: number;

                const JESSE_ACTION = 0.30;
                // "te" start offsets (at teE=0)
                const teStartX = isMobile ? 120 : 220;
                const teStartY = isMobile ? -40 : -70;
                const jBaseX = cx + (isMobile ? 30 : 60);
                const jBaseY = cy + 10;

                if (p < JESSE_ACTION) {
                    // Long curved approach from far right
                    const aP = easeInOutCubic(
                        clamp01(
                            (p - CURSOR_APPEAR) /
                                (JESSE_ACTION - CURSOR_APPEAR)
                        )
                    );
                    jx = cBez(
                        Math.min(vw - 40, cx + (isMobile ? 180 : 350)),
                        cx + (isMobile ? 160 : 280),
                        cx + (isMobile ? 80 : 160),
                        jBaseX + teStartX,
                        aP
                    );
                    jy = cBez(
                        cy - (isMobile ? 80 : 140),
                        cy + (isMobile ? 60 : 100),
                        cy - (isMobile ? 30 : 60),
                        jBaseY + teStartY,
                        aP
                    );
                } else {
                    // Action: tracks "te" text along its curved path
                    const jxActive = Math.min(jBaseX + teX, vw - 80);
                    const jyActive = jBaseY + teY;
                    const jxSettled = cx - (isMobile ? 10 : 20);
                    const jySettled = cy - (isMobile ? 55 : 85);
                    jx = lerp(jxActive, jxSettled, settleP);
                    jy = lerp(jyActive, jySettled, settleP);
                }

                jesseRef.current.style.opacity = String(
                    (visible ? 1 : 0) * cursorFade
                );
                jesseRef.current.style.transform = `translate(${jx}px, ${jy}px)`;
            }

            // ── Brooke: approaches from below, drags "am" ──
            if (brookeRef.current) {
                const visible = p > CURSOR_APPEAR;
                let brX: number, brY: number;

                const BROOKE_ACTION = 0.46;
                const amStartX = isMobile ? -30 : -50;
                const amStartY = isMobile ? 100 : 140;
                const bBaseX = cx + (isMobile ? 20 : 60);
                const bBaseY = cy + 30;

                if (p < BROOKE_ACTION) {
                    // Curved approach from below
                    const aP = easeInOutCubic(
                        clamp01(
                            (p - CURSOR_APPEAR) /
                                (BROOKE_ACTION - CURSOR_APPEAR)
                        )
                    );
                    brX = cBez(
                        cx - (isMobile ? 60 : 100),
                        cx + (isMobile ? 80 : 140),
                        cx - (isMobile ? 20 : 40),
                        bBaseX + amStartX,
                        aP
                    );
                    brY = cBez(
                        vh - (isMobile ? 30 : 50),
                        cy + (isMobile ? 160 : 220),
                        cy + (isMobile ? 80 : 120),
                        bBaseY + amStartY,
                        aP
                    );
                } else {
                    // Action: tracks "am" text along its curved path
                    const bxActive = bBaseX + amX;
                    const byActive = bBaseY + amY;
                    const bxSettled = cx - (isMobile ? 30 : 50);
                    const bySettled = cy + (isMobile ? 45 : 65);
                    brX = lerp(bxActive, bxSettled, settleP);
                    brY = lerp(byActive, bySettled, settleP);
                }

                brookeRef.current.style.opacity = String(
                    (visible ? 1 : 0) * cursorFade
                );
                brookeRef.current.style.transform = `translate(${brX}px, ${brY}px)`;
            }

            // ── Eden: approaches from bottom-right, drags "s" ──
            if (edenRef.current) {
                const visible = p > CURSOR_APPEAR;
                let ex: number, ey: number;

                const EDEN_ACTION = 0.60;
                const sStartX = isMobile ? 80 : 160;
                const sStartY = isMobile ? 70 : 110;
                const eBaseX = cx + textHalf + (isMobile ? 5 : 10);
                const eBaseY = cy + 15;

                if (p < EDEN_ACTION) {
                    // Curved approach from bottom-right
                    const aP = easeInOutCubic(
                        clamp01(
                            (p - CURSOR_APPEAR) /
                                (EDEN_ACTION - CURSOR_APPEAR)
                        )
                    );
                    ex = cBez(
                        Math.min(vw - 30, cx + (isMobile ? 150 : 300)),
                        cx + (isMobile ? 120 : 230),
                        cx + (isMobile ? 60 : 100),
                        Math.min(eBaseX + sStartX, vw - 80),
                        aP
                    );
                    ey = cBez(
                        vh - (isMobile ? 50 : 70),
                        cy + (isMobile ? 130 : 180),
                        cy + (isMobile ? 40 : 50),
                        eBaseY + sStartY,
                        aP
                    );
                } else {
                    // Action: tracks "s" text along its curved path
                    const exActive = Math.min(eBaseX + sX, vw - 80);
                    const eyActive = eBaseY + sY;
                    const exSettled = Math.min(
                        cx + textHalf + (isMobile ? 15 : 30),
                        vw - 80
                    );
                    const eySettled = cy + 10;
                    ex = lerp(exActive, exSettled, settleP);
                    ey = lerp(eyActive, eySettled, settleP);
                }

                edenRef.current.style.opacity = String(
                    (visible ? 1 : 0) * cursorFade
                );
                edenRef.current.style.transform = `translate(${ex}px, ${ey}px)`;
            }

            // ════════════════════════════════════════════════════════════
            // Subtitle + assembled state
            // ════════════════════════════════════════════════════════════

            const subP = easeOutCubic(clamp01((p - 0.75) / 0.07));
            if (subtitleRef.current) {
                subtitleRef.current.style.opacity = String(subP);
                subtitleRef.current.style.transform = `translateY(${lerp(20, 0, subP)}px)`;
            }

            const isAssembled = p >= 0.78;
            if (isAssembled !== assembledRef.current) {
                assembledRef.current = isAssembled;
                setAssembled(isAssembled);
            }

            // ── Cal transition: title shrinks up, cal fades in ──
            if (titleGroupRef.current) {
                const yShift = lerp(0, -(vh * 0.22), calP);
                const scaleVal = lerp(1, 0.55, calP);
                titleGroupRef.current.style.transform = `translateY(${yShift}px) scale(${scaleVal})`;
            }
            if (calRef.current) {
                calRef.current.style.opacity = String(calP);
                calRef.current.style.transform = `translateY(${lerp(60, 0, calP)}px)`;
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(rafId);
            observer.disconnect();
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

                {/* ── Title group (moves up + scales during cal transition) ── */}
                <div
                    ref={titleGroupRef}
                    style={{
                        position: "relative",
                        zIndex: 5,
                        willChange: "transform",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <h2
                        style={{
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
                </div>

                {/* ── Cal.com embed (fades in after text assembles) ── */}
                <div
                    ref={calRef}
                    style={{
                        position: "absolute",
                        bottom: "2%",
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        padding: "0 16px",
                        opacity: 0,
                        zIndex: 5,
                        willChange: "transform, opacity",
                        overflow: "hidden",
                    }}
                >
                    <iframe
                        src="https://cal.com/neuronui/30min?embed&theme=dark&layout=month_view"
                        style={{
                            width: "100%",
                            maxWidth: "1000px",
                            height: "min(750px, 78vh)",
                            minHeight: "500px",
                            border: "none",
                            borderRadius: "16px",
                            colorScheme: "dark",
                        }}
                        loading="lazy"
                        allow="payment"
                        scrolling="no"
                    />
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
        </section>
    );
};

export default BuiltForTeams;
