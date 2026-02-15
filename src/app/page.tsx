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
      <div id="hero" style={{ scrollSnapAlign: "start" }}>
        <Hero />
      </div>
      <div id="projects" style={{ scrollSnapAlign: "start" }}>
        <ScrollStackSection />
      </div>
      <div id="services" style={{ scrollSnapAlign: "start" }}>
        <CoreCapabilities />
      </div>
      <div id="testimonials" style={{ scrollSnapAlign: "start" }}>
        <Testimonials />
      </div>
      <div id="teams" style={{ scrollSnapAlign: "start" }}>
        <BuiltForTeams />
      </div>
      <div id="contact" style={{ scrollSnapAlign: "start" }}>
        <CalSchedule />
      </div>
      <Footer />
    </main>
  );
}
