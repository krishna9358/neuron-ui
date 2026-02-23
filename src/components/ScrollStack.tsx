"use client";

import React, { useLayoutEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = "",
}) => (
  <div
    className={`scroll-stack-card relative w-full h-80 my-8 p-12 rounded-[40px] box-border origin-top ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: "hidden",
    }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const rafIdRef = useRef(0);
  const cardsRef = useRef<HTMLElement[]>([]);

  // ── Layout Cache ──────────────────────────────────────────────────────
  // All DOM geometry reads happen here (mount + resize), NEVER during scroll.
  // This prevents forced-synchronous-layout and layout thrashing.
  const layoutCacheRef = useRef<{
    viewportHeight: number;
    sectionTop: number; // Absolute Y of the scroll-stack-container
    totalScrollRange: number; // How many px of scroll this section occupies
    cardCount: number;
  }>({
    viewportHeight: 0,
    sectionTop: 0,
    totalScrollRange: 0,
    cardCount: 0,
  });

  // ── Refresh Layout (DOM read phase — mount + resize only) ─────────────
  const refreshLayout = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const docScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    const container = scrollerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const sectionTop = containerRect.top + docScrollTop;

    const cardCount = cardsRef.current.length;

    // Total scroll range = the section height minus the viewport.
    // The sticky element is 100vh, so the "scrollable distance" within
    // this section is (total section height - 100vh).
    // We'll compute section height based on card count:
    // Each card gets one viewport-height of scroll travel + some padding.
    // Total section height = (cardCount) × 100vh + 100vh (for release)
    // Total scroll range   = (cardCount) × 100vh
    const totalScrollRange = cardCount * viewportHeight;

    layoutCacheRef.current = {
      viewportHeight,
      sectionTop,
      totalScrollRange,
      cardCount,
    };
  }, []);

  // ── Core Animation Logic ──────────────────────────────────────────────
  //
  // STRATEGY: "CSS Sticky + Absolute Cards + Scroll Progress"
  //
  // Architecture:
  //   <div class="scroll-stack-container" style="height: (N+1)*100vh">
  //     <div class="sticky" style="position: sticky; top: 0; height: 100vh">
  //       <div class="scroll-stack-card" style="position: absolute; inset: 0">
  //         Card 0 (always visible, base layer)
  //       </div>
  //       <div class="scroll-stack-card" style="position: absolute; inset: 0">
  //         Card 1 (slides up from below, z-index: 2)
  //       </div>
  //       ...
  //     </div>
  //   </div>
  //
  // How it works:
  // 1. The section has height = (cardCount + 1) × 100vh.
  //    This creates the "scroll runway" needed for the animation.
  //
  // 2. Inside it, a `position: sticky; top: 0; height: 100vh` container
  //    stays pinned to the viewport exactly like `position: fixed` but
  //    WITHOUT breaking document flow. When the section scrolls past,
  //    the sticky container naturally releases. This is the key fix for
  //    ISSUE 1 (components behind last card).
  //
  // 3. Each card is `position: absolute; inset: 0` inside the sticky.
  //    All cards occupy the SAME space. Visibility is controlled via
  //    translate3d (slide up from below) + opacity.
  //
  // 4. Scroll progress is computed as:
  //    progress = (scrollTop - sectionTop) / totalScrollRange
  //    Each card activates at progress = i / cardCount.
  //
  // 5. z-index increases with card index, so card i+1 covers card i.
  //
  // Benefits vs the old translateY-pinning approach:
  //   ✅ Sticky release is handled by CSS, not JS — no "freeze" logic
  //   ✅ No overflow leaking — cards are contained inside the sticky
  //   ✅ Stacking context is bounded — the sticky creates an isolated context
  //   ✅ Content after the section renders normally (z-index isolation)
  //   ✅ Reverse scroll is smooth — progress is linear, no lerp needed
  //
  const updateCardTransforms = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const { viewportHeight, sectionTop, totalScrollRange, cardCount } =
      layoutCacheRef.current;

    if (totalScrollRange === 0) return;

    const scrollTop = window.scrollY;

    // Overall section progress: 0 at section top, 1 when section is done
    const rawProgress = (scrollTop - sectionTop) / totalScrollRange;
    // Clamp to [0, 1] — prevents negative progress (before section)
    // and progress > 1 (after section)
    const progress = rawProgress < 0 ? 0 : rawProgress > 1 ? 1 : rawProgress;

    for (let i = 0; i < cardCount; i++) {
      const card = cards[i];
      if (!card) continue;

      // ── Per-card progress ───────────────────────────────────────
      // Card i activates at progress = i / cardCount
      // Card i is fully in at progress = (i + 0.5) / cardCount
      // (The 0.5 means each card takes half a "slot" to enter)
      const cardStartProgress = i / cardCount;
      const cardEndProgress = (i + 0.5) / cardCount;
      const cardRange = cardEndProgress - cardStartProgress;

      if (i === 0) {
        // First card: always visible, always at rest position
        card.style.transform = "translate3d(0, 0, 0)";
        card.style.opacity = "1";
        continue;
      }

      if (progress <= cardStartProgress) {
        // Card hasn't entered yet — hidden below
        card.style.transform = "translate3d(0, 100%, 0)";
        card.style.opacity = "0";
      } else if (progress >= cardEndProgress) {
        // Card fully entered — at rest position
        card.style.transform = "translate3d(0, 0, 0)";
        card.style.opacity = "1";
      } else {
        // Card is in transition — sliding up
        const t = (progress - cardStartProgress) / cardRange;
        // Ease-out cubic for premium deceleration feel
        const eased = 1 - (1 - t) * (1 - t) * (1 - t);
        const yPercent = (1 - eased) * 100;
        card.style.transform = `translate3d(0, ${yPercent}%, 0)`;
        card.style.opacity = "1";
      }
    }

    // ── Completion callback ─────────────────────────────────────────
    const lastCardDone = progress >= (cardCount - 0.5) / cardCount;
    if (lastCardDone && !stackCompletedRef.current) {
      stackCompletedRef.current = true;
      onStackComplete?.();
    } else if (!lastCardDone && stackCompletedRef.current) {
      stackCompletedRef.current = false;
    }
  }, [onStackComplete]);

  // ── Scroll Handler (rAF-coalesced) ────────────────────────────────────
  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(updateCardTransforms);
  }, [updateCardTransforms]);

  // ── Setup ─────────────────────────────────────────────────────────────
  /* eslint-disable react-hooks/exhaustive-deps */
  useLayoutEffect(() => {
    const stickyEl = stickyRef.current;
    if (!stickyEl) return;

    const cards = Array.from(
      stickyEl.querySelectorAll(".scroll-stack-card"),
    ) as HTMLElement[];
    cardsRef.current = cards;

    // ── Style each card as absolute-positioned inside the sticky ─────
    cards.forEach((card, i) => {
      // Override the document-flow layout from ScrollStackItem.
      // Cards are now absolutely positioned to fill the sticky container.
      card.style.position = "absolute";
      card.style.top = "0";
      card.style.left = "0";
      card.style.width = "100%";
      card.style.height = "100%";
      card.style.margin = "0";

      // GPU layer promotion
      card.style.transform =
        i === 0 ? "translate3d(0,0,0)" : "translate3d(0, 100%, 0)";
      card.style.opacity = i === 0 ? "1" : "0";
      card.style.backfaceVisibility = "hidden";
      card.style.willChange = "transform, opacity";
      card.style.transformOrigin = "top center";

      // Z-index: higher index = slides OVER previous cards
      card.style.zIndex = String(i + 1);
    });

    // Measure layout geometry
    refreshLayout();

    const onResize = () => {
      refreshLayout();
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", onResize);
    handleScroll(); // Set initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafIdRef.current);
      stackCompletedRef.current = false;
      cardsRef.current = [];
    };
  }, [updateCardTransforms, refreshLayout, handleScroll]);

  // ── Compute section height ────────────────────────────────────────────
  // (cardCount + 1) × 100vh: one viewport per card transition + one for release
  const cardCount = React.Children.count(children);
  const sectionHeightVh = (cardCount + 1) * 100;

  return (
    <div
      className={`scroll-stack-container relative w-full ${className}`.trim()}
      ref={scrollerRef}
      style={{
        // Section height creates the scroll runway.
        // This is how much "scroll distance" the section occupies.
        height: `${sectionHeightVh}vh`,
        // Isolate this section's stacking context completely.
        // This PREVENTS cards from leaking over subsequent sections.
        // Without this, transformed children can paint over siblings.
        zIndex: 1,
        isolation: "isolate",
      }}
    >
      {/* Sticky container: pins to viewport top while section scrolls */}
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          // CSS containment: browser can skip layout/paint of this
          // subtree when only transform/opacity change within.
          contain: "layout style paint",
        }}
      >
        {/* Padding wrapper for card inset */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            padding: "20px 80px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollStack;
