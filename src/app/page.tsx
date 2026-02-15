import Hero from "@/components/Hero";
import ScrollStackSection from "@/components/ScrollStackSection";
import CoreCapabilities from "@/components/CoreCapabilities";
import CalSchedule from "@/components/CalSchedule";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <div id="hero">
        <Hero />
      </div>
      <div id="projects">
        <ScrollStackSection />
      </div>
      <div id="capabilities">
        <CoreCapabilities />
      </div>
      <div id="contact">
        <CalSchedule />
      </div>
      <Footer />
    </main>
  );
}
