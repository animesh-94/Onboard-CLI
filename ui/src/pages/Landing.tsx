import Hero from '../components/Hero';
import BentoGrid from '../components/BentoGrid';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';

export default function Landing() {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <SEO />
      <main>
        <Hero />
        <BentoGrid />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
