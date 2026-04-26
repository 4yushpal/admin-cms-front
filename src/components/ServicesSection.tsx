import { useData } from '../context/DataContext';

export default function ServicesSection() {
  const { services, isLoading } = useData();
  const activeServices = services.filter(s => s.is_active).sort((a, b) => a.display_order - b.display_order);

  if (!isLoading && activeServices.length === 0) return null;

  // We need a base set that is wide enough to cover the screen so the seamless loop works perfectly.
  // Assuming each item is about 25vw, we need about 8 items to safely cover wide screens.
  let baseSet = [...activeServices];
  if (baseSet.length > 0) {
    while (baseSet.length < 8) {
      baseSet = [...baseSet, ...activeServices];
    }
  }

  // To make animation speed consistent regardless of the number of items, adjust duration based on baseSet length.
  const animationDuration = `${baseSet.length * 5}s`;
  const letters = ['I', 'I', 'T'];

  return (
    <section id="services" className="pt-[clamp(3rem,8vw,16rem)] pb-[clamp(1rem,3vw,6rem)] bg-uhs-light overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-[clamp(1rem,3vw,12rem)] mb-[clamp(2rem,6vw,12rem)] flex flex-col items-center text-center">
        <h2 className="text-[clamp(2.5rem,5vw,10rem)] font-heading font-black text-uhs-maroon uppercase tracking-tight relative group inline-block cursor-pointer transition-transform duration-300 hover:-translate-y-2 mb-[clamp(1rem,2vw,4rem)]">
          OUR SERVICES
          <span className="absolute -bottom-2 left-0 w-full h-[clamp(4px,0.5vw,12px)] bg-uhs-maroon scale-x-100 group-hover:scale-x-0 transition-transform duration-300 origin-left"></span>
        </h2>
        <p className="text-gray-600 max-w-[clamp(40rem,60vw,120rem)] text-[clamp(1rem,1.5vw,3rem)] mx-auto leading-relaxed">
          Explore the various facilities and programs available at IIT BOMBAY to support student growth and parent engagement.
        </p>
      </div>

      {/* Infinite Smooth Marquee Container */}
      <div className="overflow-hidden w-full group relative pt-4 pb-[clamp(2rem,4vw,8rem)]">
        {isLoading ? (
          <div className="flex gap-[clamp(2rem,6vw,12rem)] pr-[clamp(2rem,6vw,12rem)]">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex-shrink-0 w-[clamp(16rem,22vw,40rem)] flex flex-col items-center">
                <div className="text-[clamp(10rem,20vw,40rem)] leading-none font-heading font-black text-gray-200 animate-pulse">
                  {letters[(i - 1) % 3]}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* The Scrolling Track */
          <div className="flex whitespace-nowrap animate-marquee-custom w-max gap-[clamp(2rem,6vw,12rem)] pr-[clamp(2rem,6vw,12rem)]" style={{ animationDuration }}>
            {/* The Seamless Loop: render the set twice */}
            {[...baseSet, ...baseSet].map((service, index) => {
              const letter = letters[index % 3];
              return (
                <div 
                  key={`${service.id}-${index}`} 
                  className="flex-shrink-0 w-[clamp(16rem,22vw,40rem)] flex flex-col items-center group/card cursor-pointer"
                >
                  {/* The 'I', 'I', 'T' masked image using background-clip */}
                  <div 
                    className="text-[clamp(10rem,20vw,40rem)] leading-[0.8] font-heading font-black bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover/card:scale-105"
                    style={{ 
                      backgroundImage: `url(${service.icon_or_image_url || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop'})`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {letter}
                  </div>
                  
                  {/* Title and Description */}
                  <div className="text-center mt-[clamp(1.5rem,3vw,6rem)] transition-transform duration-300 group-hover/card:-translate-y-2">
                    <h3 className="text-[clamp(1.5rem,2.5vw,5rem)] font-black uppercase font-heading text-uhs-maroon mb-[clamp(0.5rem,1vw,2rem)] whitespace-normal leading-tight tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-[clamp(0.875rem,1.2vw,3rem)] whitespace-normal leading-relaxed max-w-[clamp(16rem,20vw,36rem)] mx-auto">
                      {service.short_description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Embedded Style to guarantee animation runs without Tailwind config reload issues */}
      <style>{`
        @keyframes marquee-custom {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-custom {
          animation: marquee-custom linear infinite;
        }
      `}</style>
    </section>
  );
}
