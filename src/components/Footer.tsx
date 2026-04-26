import { Phone, Mail, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Footer() {
  const { pageContent } = useData();

  const phone = pageContent.find(p => p.section_key === 'contact_phone')?.content_value || '+91 (22) 2572 2545';
  const email = pageContent.find(p => p.section_key === 'contact_email')?.content_value || 'registrar@iitb.ac.in';
  const address = pageContent.find(p => p.section_key === 'contact_address')?.content_value || 'IIT Bombay, Powai, Mumbai - 400 076, India';

  const quickLinks = [
    { name: 'Home', href: '#' },
    { name: 'About us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact us', href: '#contact' },
  ];

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
    if (href === '#') {
      smoothScrollTo(0);
    } else {
      const el = document.querySelector(href);
      if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY);
    }
  };

  return (
    <footer className="bg-uhs-dark text-white pt-12 pb-8 lg:pt-16 lg:pb-10 3xl:pt-24 3xl:pb-16 relative">
      <div className="container mx-auto px-6 lg:px-12 xl:px-24 max-w-[1600px] w-full">

        {/* Main Footer Content — centered columns */}
        <div className="flex flex-col md:flex-row items-stretch justify-center mb-12 lg:mb-16 3xl:mb-20">

          {/* Column 1: Contact — right-aligned toward the divider */}
          <div className="flex flex-col items-center md:items-end md:text-right flex-1 md:max-w-md 3xl:max-w-lg">
            <h4 className="text-xl lg:text-2xl 3xl:text-3xl font-heading font-bold uppercase tracking-wider mb-6 lg:mb-8 text-uhs-orange">Contact</h4>
            <ul className="space-y-4 lg:space-y-6">
              <li className="flex items-center gap-4 md:flex-row-reverse">
                <Phone className="w-5 h-5 lg:w-6 lg:h-6 3xl:w-8 3xl:h-8 text-uhs-maroon flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base 3xl:text-xl">{phone}</a>
              </li>
              <li className="flex items-center gap-4 md:flex-row-reverse">
                <Mail className="w-5 h-5 lg:w-6 lg:h-6 3xl:w-8 3xl:h-8 text-uhs-maroon flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base 3xl:text-xl break-all">{email}</a>
              </li>
              <li className="flex items-center gap-4 md:flex-row-reverse">
                <MapPin className="w-5 h-5 lg:w-6 lg:h-6 3xl:w-8 3xl:h-8 text-uhs-maroon flex-shrink-0" />
                <span className="text-gray-300 text-sm lg:text-base 3xl:text-xl">{address}</span>
              </li>
            </ul>
          </div>

          {/* Vertical Maroon Divider */}
          <div className="hidden md:block w-[3px] lg:w-[4px] 3xl:w-[6px] bg-uhs-maroon mx-10 lg:mx-16 3xl:mx-24 self-stretch"></div>
          <div className="block md:hidden w-32 h-[3px] bg-uhs-maroon mx-auto my-8"></div>

          {/* Column 2: Quicklinks — left-aligned away from the divider */}
          <div className="flex flex-col items-center md:items-start md:text-left flex-1 md:max-w-md 3xl:max-w-lg">
            <h4 className="text-xl lg:text-2xl 3xl:text-3xl font-heading font-bold uppercase tracking-wider mb-6 lg:mb-8 text-uhs-orange">Quicklinks</h4>
            <ul className="space-y-4 lg:space-y-6">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 uppercase text-sm lg:text-base 3xl:text-xl tracking-wide cursor-pointer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 lg:pt-8 text-center text-xs lg:text-sm 3xl:text-lg text-gray-500">
          <p className="mb-1">Made with ❤️ by Ayush </p>
        </div>
      </div>
    </footer>
  );
}
