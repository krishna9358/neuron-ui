import Hero from "@/components/Hero";
import ScrollStackSection from "@/components/ScrollStackSection";
import CoreCapabilities from "@/components/CoreCapabilities";
import CalSchedule from "@/components/CalSchedule";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollStackSection />
      <CoreCapabilities />
      <CalSchedule />
    </main>
  );
}
