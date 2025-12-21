import { Footer } from "@/app/components/layouts/footer/GuestFooter";
import { CTA } from "@/app/components/sections/public/CTA";
import { Testimonials } from "@/app/components/sections/public/Testimonials";
import { WhySection } from "@/app/components/sections/public/WhySection";
import { ProvidersList } from "@/app/components/sections/public/ProviderList";
import { FreelanceBanner } from "@/app/components/sections/public/FreelanceBanner";
import Header from "@/app/components/layouts/headers/GuestHeader";
import { Hero } from "@/app/components/sections/public/HomeHero";
import { Services } from "@/app/components/sections/public/Services";
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
