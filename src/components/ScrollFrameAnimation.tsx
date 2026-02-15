"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const FRAME_COUNT = 240;
const TOTAL_SCROLL_VH = 700; // Pure frame animation scroll distance

type PinState = "before" | "pinned" | "after";

export default function ScrollFrameAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressWrapRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const pinRef = useRef<PinState>("before");
  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const winRef = useRef({ w: 0, h: 0 });

  // Track window dimensions
  useEffect(() => {
    const sync = () => {
      winRef.current = { w: window.innerWidth, h: window.innerHeight };
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Preload all 240 frames
  useEffect(() => {
    let count = 0;
    const imgs: HTMLImageElement[] = [];

    const onDone = () => {
      count++;
      setLoadProgress(Math.round((count / FRAME_COUNT) * 100));
      if (count >= FRAME_COUNT) {
        imagesRef.current = imgs;
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames-01/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;
      img.onload = onDone;
      img.onerror = onDone;
      imgs.push(img);
    }

    return () => {
      imgs.forEach((i) => {
        i.onload = null;
        i.onerror = null;
      });
    };
  }, []);

  // Draw a frame on the canvas (cover mode, retina-aware)
  const drawFrame = useCallback((idx: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[idx];
    if (!img?.complete || !img.naturalWidth) return;

    const dpr = window.devicePixelRatio || 1;
    const { w, h } = winRef.current;
    const tw = Math.round(w * dpr);
    const th = Math.round(h * dpr);

    if (c.width !== tw || c.height !== th) {
      c.width = tw;
      c.height = th;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw: number, dh: number;
    if (ir > cr) {
      dh = h;
      dw = h * ir;
    } else {
      dw = w;
      dh = w / ir;
    }
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }, []);

  // Scroll handler — pins canvas and advances frames
  useEffect(() => {
    if (!isLoaded) return;
    drawFrame(0);

    const update = () => {
      const section = sectionRef.current;
      const wrapper = wrapperRef.current;
      const canvas = canvasRef.current;
      const progressBar = progressBarRef.current;
      const progressWrap = progressWrapRef.current;
      if (!section || !wrapper || !canvas) return;

      const rect = section.getBoundingClientRect();
      const { h: wH } = winRef.current;

      // BEFORE
      if (rect.top > 0) {
        if (pinRef.current !== "before") {
          pinRef.current = "before";
          wrapper.style.position = "absolute";
          wrapper.style.top = "0";
          wrapper.style.bottom = "";
          wrapper.style.zIndex = "1";
        }
        if (progressWrap) progressWrap.style.opacity = "0";
        return;
      }

      // AFTER
      if (rect.bottom <= wH) {
        if (pinRef.current !== "after") {
          pinRef.current = "after";
          wrapper.style.position = "absolute";
          wrapper.style.top = "";
          wrapper.style.bottom = "0";
          wrapper.style.zIndex = "1";
        }
        if (frameRef.current !== FRAME_COUNT - 1) {
          frameRef.current = FRAME_COUNT - 1;
          drawFrame(FRAME_COUNT - 1);
        }
        if (progressWrap) progressWrap.style.opacity = "0";
        return;
      }

      // PINNED
      if (pinRef.current !== "pinned") {
        pinRef.current = "pinned";
        wrapper.style.position = "fixed";
        wrapper.style.top = "0";
        wrapper.style.bottom = "";
        wrapper.style.zIndex = "50";
      }

      const scrolled = -rect.top;
      const range = section.offsetHeight - wH;
      const progress = Math.max(0, Math.min(1, scrolled / range));
      const idx = Math.round(progress * (FRAME_COUNT - 1));

      if (idx !== frameRef.current) {
        frameRef.current = idx;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(idx));
      }

      // Progress indicator
      if (progressBar) progressBar.style.width = `${progress * 100}%`;
      if (progressWrap) progressWrap.style.opacity = progress < 0.95 ? "1" : "0";
    };

    window.addEventListener("scroll", update, { passive: true });
    const onResize = () => drawFrame(frameRef.current);
    window.addEventListener("resize", onResize);
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isLoaded, drawFrame]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: `${TOTAL_SCROLL_VH}vh`,
        backgroundColor: "#0a0a0a",
      }}
    >
      <div
        ref={wrapperRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!isLoaded ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "220px",
                height: "3px",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${loadProgress}%`,
                  height: "100%",
                  backgroundColor: "#1145A0",
                  borderRadius: "2px",
                  transition: "width 0.15s ease-out",
                }}
              />
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "13px",
                fontWeight: 400,
                letterSpacing: "0.5px",
              }}
            >
              Loading experience · {loadProgress}%
            </span>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%", display: "block" }}
            />

            {/* Scroll progress indicator */}
            <div
              ref={progressWrapRef}
              style={{
                position: "absolute",
                bottom: 32,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                opacity: 0,
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "2px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: "1px",
                  overflow: "hidden",
                }}
              >
                <div
                  ref={progressBarRef}
                  style={{
                    width: "0%",
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    borderRadius: "1px",
                  }}
                />
              </div>
              <span
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "11px",
                  fontWeight: 400,
                  letterSpacing: "1px",
                  textTransform: "uppercase" as const,
                }}
              >
                Scroll to explore
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
