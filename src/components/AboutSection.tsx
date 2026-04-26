import { useData } from '../context/DataContext';

export default function AboutSection() {
  const { pageContent } = useData();

  const dynamicTitle = pageContent.find(p => p.section_key === 'about_description')?.title || 'CREATING BRIGHT FUTURES';
  const aboutDescription = pageContent.find(p => p.section_key === 'about_description')?.content_value
    || 'We foster a personalised approach to learning, seeking to extend skills, dispositions, and interests by engaging students in a world class learning experience.';

  const renderTitle = (title: string) => {
    const parts = title.split(/(BRIGHT)/i);
    return parts.map((part, index) => {
      if (part.toUpperCase() === 'BRIGHT') {
        return (
          <span key={index} className="relative inline-block text-uhs-maroon">
            {/* Invisible copy to always reserve full width */}
            <span className="invisible">{part}</span>
            {/* Animated overlay on top */}
            <span className="absolute top-0 left-0 overflow-hidden whitespace-nowrap border-r-[0.1em] border-uhs-maroon animate-typing">
              {part}
            </span>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <section id="about" className="relative bg-white py-[clamp(3rem,8vw,16rem)] overflow-hidden">
      <style>{`
        @keyframes typing-untyping {
          0%, 10% { max-width: 0; border-right-color: currentColor; }
          40%, 60% { max-width: 100%; border-right-color: transparent; }
          90%, 100% { max-width: 0; border-right-color: currentColor; }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: currentColor }
        }
        .animate-typing {
          animation: typing-untyping 4s steps(6, end) infinite;
        }
      `}</style>

      {/* Top curved sweep — exact mirror of Hero bottom curves */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none rotate-180">
        <svg viewBox="0 0 1920 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none" style={{ height: 'clamp(50px, 15vh, 400px)' }}>
          <path d="M0 200 L0 180 Q 960 200, 1920 50 L 1920 200 Z" fill="#800020" />
          <path d="M0 200 L0 200 Q 960 220, 1920 80 L 1920 200 Z" fill="#2d2d2d" />
        </svg>
      </div>

      {/* Decorative leaf/laurel shapes (right side, faded) */}
      <div className="absolute right-[clamp(1rem,5vw,10rem)] top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none">
        <svg width="280" height="400" viewBox="0 0 280 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[clamp(150px,20vw,600px)] h-auto">
          {/* Leaf 1 */}
          <ellipse cx="140" cy="80" rx="40" ry="70" transform="rotate(-20 140 80)" fill="#555" />
          {/* Leaf 2 */}
          <ellipse cx="180" cy="140" rx="35" ry="65" transform="rotate(15 180 140)" fill="#555" />
          {/* Leaf 3 */}
          <ellipse cx="100" cy="160" rx="38" ry="68" transform="rotate(-40 100 160)" fill="#555" />
          {/* Leaf 4 */}
          <ellipse cx="160" cy="240" rx="36" ry="60" transform="rotate(25 160 240)" fill="#555" />
          {/* Leaf 5 */}
          <ellipse cx="120" cy="300" rx="34" ry="62" transform="rotate(-15 120 300)" fill="#555" />
          {/* Leaf 6 */}
          <ellipse cx="170" cy="340" rx="30" ry="55" transform="rotate(30 170 340)" fill="#555" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-[clamp(1.5rem,4vw,12rem)] max-w-7xl 3xl:max-w-[120rem] 4xl:max-w-[160rem] 5xl:max-w-[200rem] 6xl:max-w-[280rem]">
        {/* Section Title */}
        <div className="flex justify-center text-center mb-[clamp(2rem,6vw,12rem)]">
          <h2 className="text-[clamp(2.5rem,5vw,10rem)] font-heading font-black text-uhs-maroon uppercase tracking-tight relative group inline-block cursor-pointer transition-transform duration-300 hover:-translate-y-2">
            ABOUT US
            <span className="absolute -bottom-2 left-0 w-full h-[clamp(4px,0.5vw,12px)] bg-uhs-maroon scale-x-100 group-hover:scale-x-0 transition-transform duration-300 origin-left"></span>
          </h2>
        </div>

        <div className="lg:grid lg:grid-cols-2 gap-[clamp(2rem,6vw,16rem)] items-start">
          {/* Left Column: Fixed Label & Dynamic Title */}
          <div>
            <p className="text-uhs-maroon font-heading font-bold text-[clamp(0.75rem,1vw,2.5rem)] tracking-[0.35em] uppercase mb-[clamp(1.5rem,3vw,6rem)]">
              IIT BOMBAY
            </p>
            <div className="space-y-[clamp(0.25rem,1vw,2rem)] mb-[clamp(2rem,4vw,10rem)]">
              <h2 className="font-heading font-black text-gray-900 leading-[0.9] uppercase tracking-tight flex flex-wrap gap-x-[clamp(1rem,2vw,4rem)] gap-y-[clamp(0.5rem,1vw,2rem)] text-[clamp(2rem,6vw,12rem)]">
                {renderTitle(dynamicTitle)}
              </h2>
            </div>
          </div>

          {/* Right Column: Text Content */}
          <div className="lg:pt-[clamp(2rem,5vw,10rem)]">
            <p className="text-gray-600 text-[clamp(1rem,1.5vw,3.5rem)] leading-relaxed whitespace-pre-wrap">
              {aboutDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
