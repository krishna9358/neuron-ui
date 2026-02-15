"use client";

import React, { useEffect, useRef, useState } from "react";

// ── Color palette (matching reference) ──
const PALETTE = {
  teal: "#459a85",
  orange: "#ff9b68",
  blue: "#7b8cde",
  grey: "#a3a3a3",
  pink: "#ff90c3",
};

interface BubbleItem {
  text: string;
  type: "text" | "emoji";
  color: string;
}

// ── Tab data ──
const CAPABILITIES_ITEMS: BubbleItem[] = [
  { text: "Motion & Interaction", type: "text", color: PALETTE.teal },
  { text: "Web apps", type: "text", color: PALETTE.orange },
  { text: "eCommerce", type: "text", color: PALETTE.teal },
  { text: "No code", type: "text", color: PALETTE.blue },
  { text: "SEO", type: "text", color: PALETTE.orange },
  { text: "Full-stack", type: "text", color: PALETTE.grey },
  { text: "Creative frontend", type: "text", color: PALETTE.orange },
  { text: "Less code", type: "text", color: PALETTE.pink },
  { text: "AI", type: "text", color: PALETTE.pink },
  { text: "Headless CMS", type: "text", color: PALETTE.blue },
  { text: "Performance", type: "text", color: PALETTE.grey },
  { text: "Accessibility", type: "text", color: PALETTE.teal },
  { text: "Responsive Design", type: "text", color: PALETTE.orange },
  { text: "Animations", type: "text", color: PALETTE.pink },
  { text: "Cloud Native", type: "text", color: PALETTE.blue },
  { text: "Micro-frontends", type: "text", color: PALETTE.grey },
  { text: "🪐", type: "emoji", color: PALETTE.pink },
  { text: "📺", type: "emoji", color: PALETTE.orange },
  { text: "🎮", type: "emoji", color: PALETTE.orange },
  { text: "🎯", type: "emoji", color: PALETTE.blue },
  { text: "👻", type: "emoji", color: PALETTE.teal },
  { text: "🤝", type: "emoji", color: PALETTE.pink },
  { text: "🧗", type: "emoji", color: PALETTE.blue },
  { text: "💪", type: "emoji", color: PALETTE.teal },
  { text: "🔥", type: "emoji", color: PALETTE.pink },
  { text: "🎖️", type: "emoji", color: PALETTE.blue },
  { text: "⚡", type: "emoji", color: PALETTE.orange },
  { text: "🧠", type: "emoji", color: PALETTE.teal },
  { text: "🎨", type: "emoji", color: PALETTE.pink },
  { text: "🌟", type: "emoji", color: PALETTE.orange },
];

const TECH_STACKS_ITEMS: BubbleItem[] = [
  { text: "React", type: "text", color: PALETTE.blue },
  { text: "Next.js", type: "text", color: PALETTE.grey },
  { text: "TypeScript", type: "text", color: PALETTE.blue },
  { text: "Node.js", type: "text", color: PALETTE.teal },
  { text: "Tailwind CSS", type: "text", color: PALETTE.blue },
  { text: "Three.js", type: "text", color: PALETTE.grey },
  { text: "Framer Motion", type: "text", color: PALETTE.pink },
  { text: "GSAP", type: "text", color: PALETTE.teal },
  { text: "Prisma", type: "text", color: PALETTE.blue },
  { text: "GraphQL", type: "text", color: PALETTE.pink },
  { text: "Shopify", type: "text", color: PALETTE.teal },
  { text: "Vercel", type: "text", color: PALETTE.grey },
  { text: "PostgreSQL", type: "text", color: PALETTE.blue },
  { text: "Redis", type: "text", color: PALETTE.orange },
  { text: "Docker", type: "text", color: PALETTE.blue },
  { text: "AWS", type: "text", color: PALETTE.orange },
  { text: "Firebase", type: "text", color: PALETTE.orange },
  { text: "Supabase", type: "text", color: PALETTE.teal },
  { text: "⚛️", type: "emoji", color: PALETTE.blue },
  { text: "🔷", type: "emoji", color: PALETTE.blue },
  { text: "🟢", type: "emoji", color: PALETTE.teal },
  { text: "💨", type: "emoji", color: PALETTE.blue },
  { text: "🎲", type: "emoji", color: PALETTE.grey },
  { text: "🎬", type: "emoji", color: PALETTE.pink },
  { text: "🧩", type: "emoji", color: PALETTE.blue },
  { text: "💎", type: "emoji", color: PALETTE.blue },
  { text: "🚀", type: "emoji", color: PALETTE.orange },
  { text: "🐳", type: "emoji", color: PALETTE.blue },
  { text: "☁️", type: "emoji", color: PALETTE.grey },
  { text: "🔧", type: "emoji", color: PALETTE.teal },
];

const SERVICES_ITEMS: BubbleItem[] = [
  { text: "Web Development", type: "text", color: PALETTE.teal },
  { text: "UI/UX Design", type: "text", color: PALETTE.orange },
  { text: "Brand Identity", type: "text", color: PALETTE.pink },
  { text: "SEO Optimization", type: "text", color: PALETTE.teal },
  { text: "eCommerce Solutions", type: "text", color: PALETTE.orange },
  { text: "Consulting", type: "text", color: PALETTE.blue },
  { text: "Mobile Apps", type: "text", color: PALETTE.orange },
  { text: "API Integration", type: "text", color: PALETTE.grey },
  { text: "Maintenance", type: "text", color: PALETTE.teal },
  { text: "Analytics", type: "text", color: PALETTE.blue },
  { text: "Performance Audit", type: "text", color: PALETTE.orange },
  { text: "Cloud Hosting", type: "text", color: PALETTE.blue },
  { text: "Data Migration", type: "text", color: PALETTE.grey },
  { text: "DevOps", type: "text", color: PALETTE.teal },
  { text: "Training", type: "text", color: PALETTE.pink },
  { text: "Product Strategy", type: "text", color: PALETTE.blue },
  { text: "🌐", type: "emoji", color: PALETTE.teal },
  { text: "🎨", type: "emoji", color: PALETTE.orange },
  { text: "✨", type: "emoji", color: PALETTE.pink },
  { text: "📈", type: "emoji", color: PALETTE.teal },
  { text: "🛒", type: "emoji", color: PALETTE.orange },
  { text: "💡", type: "emoji", color: PALETTE.blue },
  { text: "📱", type: "emoji", color: PALETTE.orange },
  { text: "🔗", type: "emoji", color: PALETTE.grey },
  { text: "🛠️", type: "emoji", color: PALETTE.teal },
  { text: "📊", type: "emoji", color: PALETTE.blue },
  { text: "🏗️", type: "emoji", color: PALETTE.grey },
  { text: "🎓", type: "emoji", color: PALETTE.pink },
  { text: "🧭", type: "emoji", color: PALETTE.orange },
  { text: "🔒", type: "emoji", color: PALETTE.blue },
];

const tabs = ["CORE CAPABILITIES", "TECH STACKS", "SERVICES"] as const;
type TabType = (typeof tabs)[number];

const tabContent: Record<TabType, BubbleItem[]> = {
  "CORE CAPABILITIES": CAPABILITIES_ITEMS,
  "TECH STACKS": TECH_STACKS_ITEMS,
  SERVICES: SERVICES_ITEMS,
};

function getBubbleDimensions(item: BubbleItem) {
  const isEmoji = item.type === "emoji";
  const letterWidth = 10;
  const padding = isEmoji ? 40 : 50;
  const width = isEmoji
    ? 60
    : Math.max(80, item.text.length * letterWidth + padding);
  return { width, height: 60 };
}

const CoreCapabilities: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matterRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engineRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const runnerRef = useRef<any>(null);
  const bubblesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [activeTab, setActiveTab] = useState<TabType>("CORE CAPABILITIES");
  const [matterLoaded, setMatterLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Load Matter.js dynamically (avoids SSR issues)
  useEffect(() => {
    import("matter-js").then((mod) => {
      matterRef.current = mod;
      setMatterLoaded(true);
    });
  }, []);

  // Detect when section scrolls into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Initialize / reinitialize physics world
  useEffect(() => {
    if (!matterLoaded || !isVisible || !sceneRef.current || !matterRef.current)
      return;

    const Matter = matterRef.current;
    const { Engine, World, Bodies, Runner, Events } = Matter;

    // Cleanup previous engine
    if (runnerRef.current) Runner.stop(runnerRef.current);
    if (engineRef.current) Engine.clear(engineRef.current);

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    const container = sceneRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Boundaries (ground + walls)
    const ground = Bodies.rectangle(
      width / 2,
      height + 100,
      width + 200,
      200,
      { isStatic: true }
    );
    const wallLeft = Bodies.rectangle(-100, height / 2, 200, height * 2, {
      isStatic: true,
    });
    const wallRight = Bodies.rectangle(
      width + 100,
      height / 2,
      200,
      height * 2,
      { isStatic: true }
    );
    World.add(world, [ground, wallLeft, wallRight]);

    // Create bubble bodies for current tab
    const items = tabContent[activeTab];
    const dims = items.map((item) => getBubbleDimensions(item));

    const bubbleBodies = items.map((_item: BubbleItem, i: number) => {
      const { width: bw, height: bh } = dims[i];
      const x = Math.random() * (width - 200) + 100;
      const y = -Math.random() * 1500 - 100;

      return Bodies.rectangle(x, y, bw, bh, {
        chamfer: { radius: bh / 2 },
        restitution: 0.6,
        friction: 0.1,
        frictionAir: 0.01,
        angle: Math.random() * Math.PI * 0.2 - Math.PI * 0.1,
        label: i.toString(),
      });
    });

    World.add(world, bubbleBodies);

    // Physics runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Sync DOM elements to physics body positions
    Events.on(engine, "afterUpdate", () => {
      bubbleBodies.forEach(
        (
          body: {
            position: { x: number; y: number };
            angle: number;
            label: string;
          },
          idx: number
        ) => {
          const el = bubblesRef.current.get(body.label);
          if (el) {
            const { x, y } = body.position;
            const angle = body.angle;
            el.style.transform = `translate(${x - dims[idx].width / 2}px, ${y - dims[idx].height / 2}px) rotate(${angle}rad)`;
          }
        }
      );
    });

    return () => {
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, [matterLoaded, activeTab, isVisible]);

  // Compute DOM items for rendering
  const items = tabContent[activeTab];
  const domItems = items.map((item, i) => ({
    ...item,
    id: i.toString(),
    ...getBubbleDimensions(item),
  }));

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#0a0a0a",
        padding: "16px",
      }}
    >
      {/* White card container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          borderRadius: "20px",
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {/* Tab bar */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "32px",
              alignItems: "center",
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontSize: "12px",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: isActive ? "#1a1a1a" : "#999",
                    background: "none",
                    border: "none",
                    borderLeft: isActive
                      ? "2px solid rgba(0,0,0,0.1)"
                      : "none",
                    borderRight: isActive
                      ? "2px solid rgba(0,0,0,0.1)"
                      : "none",
                    borderTop: "none",
                    borderBottom: "none",
                    borderRadius: isActive ? "8px" : "0",
                    padding: isActive ? "8px 16px" : "8px 0",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isActive ? `${tab} ` : tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Physics scene — pointer-events: none so scrolling works */}
        <div
          ref={sceneRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          {matterLoaded &&
            isVisible &&
            domItems.map((item) => (
              <div
                key={`${activeTab}-${item.id}`}
                ref={(el) => {
                  if (el) bubblesRef.current.set(item.id, el);
                  else bubblesRef.current.delete(item.id);
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                  borderRadius: "30px",
                  backgroundColor: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  willChange: "transform",
                  transform: "translate(-1000px, -1000px)",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    pointerEvents: "none",
                    fontSize: item.type === "emoji" ? "24px" : "16px",
                    fontWeight: item.type === "text" ? 500 : 400,
                    letterSpacing: item.type === "text" ? "0.5px" : "0",
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
        </div>

        {/* Loading state */}
        {!matterLoaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ccc",
              fontSize: "14px",
              letterSpacing: "1px",
            }}
          >
            Loading...
          </div>
        )}
      </div>
    </section>
  );
};

export default CoreCapabilities;
