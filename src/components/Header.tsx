import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Header() {
  const { pageContent } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const schoolName = pageContent.find(p => p.section_key === 'school_name')?.content_value || 'UNDERDALE HIGH SCHOOL';
  const shortName = pageContent.find(p => p.section_key === 'school_short_name')?.content_value || 'UHS';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsScrolled(currentScrollPos > 50);

      if (prevScrollPos > currentScrollPos || currentScrollPos < 50) {
        setIsVisible(true);
      } else if (currentScrollPos > 100) {
        setIsVisible(false);
      }
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact us', href: '#contact' },
  ];

  const logoRow = pageContent.find(p => p.section_key === 'hero_logo_url' || p.section_key === 'home-page');
  const logoUrl = logoRow?.image_url || (logoRow?.section_key === 'hero_logo_url' ? logoRow?.content_value : null);

  const smoothScrollTo = (targetY: number, duration = 1200) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime: number | null = null;
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      window.scrollTo(0, startY + diff * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (href === '#') {
      smoothScrollTo(0);
    } else {
      const el = document.querySelector(href);
      if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY);
    }
  };

  return (
    <>
      {/* Static Fixed Header Elements */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none h-0">
        
        {/* Logo - Fixed Top Left Corner */}
        <div className="absolute top-0 left-0 pointer-events-auto bg-uhs-maroon text-white pt-[clamp(0.5rem,1vw,2rem)] pb-[clamp(1rem,4vw,6rem)] px-[clamp(0.5rem,2vw,4rem)] lg:pb-[clamp(2rem,6vw,12rem)] lg:px-[clamp(1rem,3vw,6rem)] rounded-br-[clamp(2rem,6vw,16rem)] flex flex-col items-center justify-start shadow-2xl border-b-[clamp(2px,0.5vw,8px)] border-r-[clamp(2px,0.5vw,8px)] border-uhs-orange/20">
          {logoUrl ? (
            <img src={logoUrl} alt="School Logo" className="w-[clamp(3.5rem,10vw,20rem)] object-contain" />
          ) : (
            <>
              <div className="w-[clamp(2.5rem,6vw,12rem)] h-[clamp(2.5rem,6vw,12rem)] bg-white text-uhs-maroon rounded-full flex items-center justify-center font-bold text-[clamp(1rem,2.5vw,5rem)] tracking-widest shadow-inner mb-[clamp(0.5rem,1vw,2rem)] border-[clamp(2px,0.5vw,8px)] border-gray-200">
                {shortName}
              </div>
              <span className="font-heading font-black hidden 2xs:block text-[clamp(0.5rem,1vw,2rem)] text-center leading-tight tracking-wider uppercase">
                {schoolName.split(' ').map((word, i) => <span key={i}>{word}{i === 0 && <br />}</span>)}
              </span>
            </>
          )}
        </div>

        {/* Menu Button - Fixed Top Right (Mobile Only) */}
        <div className="absolute top-4 right-4 pointer-events-auto lg:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200 text-uhs-maroon focus:outline-none transition-transform hover:scale-105 active:scale-95"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sliding Header (Background + Navigation for Desktop) */}
      <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-[200%]'}`}>
        <div className="w-full flex items-center justify-center relative">

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex absolute inset-x-0 mx-auto justify-center pt-[clamp(6rem,10vw,20rem)] pb-[clamp(1.5rem,2vw,4rem)] pointer-events-none w-max">
            <div className={`flex items-center space-x-[clamp(0.5rem,1vw,2rem)] px-[clamp(1rem,2vw,4rem)] py-[clamp(0.5rem,1vw,2rem)] rounded-full transition-all duration-300 pointer-events-auto ${isScrolled ? 'bg-white/80 shadow-md backdrop-blur-md' : 'bg-white/10 backdrop-blur-sm'}`}>
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="font-bold text-[clamp(0.875rem,1.2vw,2.5rem)] transition-all duration-200 uppercase tracking-widest text-uhs-maroon hover:text-white hover:bg-uhs-maroon px-[clamp(1rem,1.5vw,3rem)] py-[clamp(0.5rem,0.8vw,1.5rem)] rounded-full">
                  {link.name}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu (Slide Effect) */}
      <div 
        className={`lg:hidden fixed inset-0 w-full h-full bg-white z-40 transition-transform duration-500 ease-in-out flex flex-col justify-center ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col px-8 space-y-6 overflow-y-auto max-h-screen">
          {navLinks.map((link, index) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)} 
              className="text-uhs-maroon font-black text-3xl uppercase tracking-widest border-b border-gray-100 pb-4 break-words transition-opacity duration-300"
              style={{ transitionDelay: isMenuOpen ? `${index * 100 + 300}ms` : '0ms', opacity: isMenuOpen ? 1 : 0 }}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
