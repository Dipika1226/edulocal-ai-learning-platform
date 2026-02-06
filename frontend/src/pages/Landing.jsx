import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/features";
import HowItWorks from "../components/HowItWorks";
import Community from "../components/Community";
import { Stats } from "../components/Stats";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Community />
      <FinalCTA />
      <Footer />
    </>
  );
}
