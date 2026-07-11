import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Testimonials from '../components/Testimonials';
import { SEO } from '../components/SEO';

export default function Landing() {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white/20 selection:text-white">
      <SEO />
      <main>
        <Hero />
        <Testimonials />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
