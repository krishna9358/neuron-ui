import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollStackSection from "@/components/ScrollStackSection";
import CoreCapabilities from "@/components/CoreCapabilities";
import BuiltForTeams from "@/components/BuiltForTeams";
import Testimonials from "@/components/Testimonials";
import CalSchedule from "@/components/CalSchedule";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div id="hero">
        <Hero />
      </div>
      <div id="projects">
        <ScrollStackSection />
      </div>
      {/* 
        Every section AFTER the scroll stack needs position: relative + z-index: 2
        so it paints ABOVE the scroll-stack-container (which has z-index: 1).
        Without this, the last pinned card could visually overlap these sections
        because transform creates new stacking contexts.
      */}
      <div
        id="services"
        style={{ position: "relative", zIndex: 2, background: "#0a0a0a" }}
      >
        <CoreCapabilities />
      </div>
      <div
        id="testimonials"
        style={{ position: "relative", zIndex: 2, background: "#0a0a0a" }}
      >
        <Testimonials />
      </div>
      <div
        id="teams"
        style={{ position: "relative", zIndex: 2, background: "#0a0a0a" }}
      >
        <BuiltForTeams />
      </div>
      <div
        id="contact"
        style={{ position: "relative", zIndex: 2, background: "#0a0a0a" }}
      >
        <CalSchedule />
      </div>
      <div style={{ position: "relative", zIndex: 2, background: "#0a0a0a" }}>
        <Footer />
      </div>
    </main>
  );
}
