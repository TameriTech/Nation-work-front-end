import { Footer } from "@/app/components/guest/GuestFooter";
import { CTA } from "@/app/components/guest/sections/CTA";
import { Testimonials } from "@/app/components/guest/sections/Testimonials";
import { WhySection } from "@/app/components/guest/sections/WhySection";
import { ProvidersList } from "@/app/components/guest/sections/ProviderList";
import { FreelanceBanner } from "@/app/components/guest/sections/FreelanceBanner";
import Header from "@/app/components/guest/GuestHeader";
import { Hero } from "@/app/components/guest/sections/HomeHero";
import { Services } from "@/app/components/guest/sections/Services";
import "@/app/globals.css";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <FreelanceBanner />
      <ProvidersList />
      <WhySection />
      <CTA />
      <Testimonials />
      <Footer />
    </>
  );
}
