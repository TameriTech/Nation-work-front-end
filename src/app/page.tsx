import Image from "next/image";
import { Footer } from "./components/layout/landingPage/Footer";
import { CTA } from "./components/shared/CTA";
import { Testimonials } from "./components/shared/Testimonials";
import { WhySection } from "./components/shared/WhySection";
import { ProvidersList } from "./components/shared/ProvidersList";
import { FreelanceBanner } from "./components/shared/FreelanceBanner";
import Header from "./components/layout/landingPage/Header";
import { Hero } from "./components/shared/Hero";
import { Services } from "./components/shared/services";

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
