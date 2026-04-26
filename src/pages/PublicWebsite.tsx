import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import GallerySection from '../components/GallerySection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function PublicWebsite() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
      setWindowWidth(window.innerWidth);
    };

    // Initial calculation
    setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // ONLY enable reveal effect on desktop screens (>=1024px) to prevent all mobile scrolling bugs
  const isRevealEffectEnabled = windowWidth >= 1024 && footerHeight > 0;

  return (
    <div className="font-sans bg-uhs-dark min-h-screen flex flex-col">
      <Header />
      <main
        className={`relative z-10 bg-uhs-light transition-all duration-300 ${isRevealEffectEnabled ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'flex-grow'}`}
        style={{ marginBottom: isRevealEffectEnabled ? `${footerHeight}px` : '0px' }}
      >
        <Hero />
        <AboutSection />
        <ServicesSection />
        <GallerySection />
        <ContactSection />
      </main>
      <div
        ref={footerRef}
        className={`${isRevealEffectEnabled ? 'fixed bottom-0 left-0 w-full z-0' : 'relative z-10 mt-auto'} border-t-8 border-uhs-maroon`}
      >
        <Footer />
      </div>
    </div>
  );
}
