import { ArrowDown } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Hero() {
  const { pageContent, galleryImages } = useData();
  const titleRow = pageContent.find(p => p.section_key === 'hero_title' || p.section_key === 'home-page');
  const heroTitle = titleRow?.content_value || 'UNDERDALE HIGH SCHOOL';
  
  // Use first campus image or fallback
  const heroBg = galleryImages.find(g => g.category === 'Campus')?.image_url || galleryImages[0]?.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070';

  const bgRow = pageContent.find(p => p.section_key === 'hero_video_url_bg' || p.section_key === 'home-page');
  const heroBgVideo = bgRow?.video_url || bgRow?.content_value;

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const youtubeId = heroBgVideo ? getYoutubeId(heroBgVideo) : null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-uhs-dark">
      {/* Background Video or Image */}
      {youtubeId ? (
        <iframe
          className="absolute inset-0 w-full h-full object-cover scale-[1.5] pointer-events-none"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1`}
          title="Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
        />
      ) : heroBgVideo ? (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src={heroBgVideo} type="video/mp4" />
        </video>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform hover:scale-100 transition-transform duration-[10s]"
          style={{ backgroundImage: `url("${heroBg}")` }}
        />
      )}
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main Center Content (Website Title) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-[clamp(1rem,4vw,8rem)] pointer-events-none">
        <h1 className="font-heading font-black text-[clamp(2.5rem,8vw,14rem)] tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)] leading-tight uppercase text-center text-white/45">
          {heroTitle}
        </h1>
      </div>

      {/* Curved Overlays at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10">
        <svg viewBox="0 0 1920 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block transform translate-y-1" preserveAspectRatio="none" style={{ height: 'clamp(100px, 15vh, 400px)' }}>
          <path d="M0 200 L0 180 Q 960 200, 1920 50 L 1920 200 Z" fill="#800020" />
          <path d="M0 200 L0 200 Q 960 220, 1920 80 L 1920 200 Z" fill="#2d2d2d" />
        </svg>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-[clamp(1rem,4vw,6rem)] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center group cursor-pointer">
        <div className="relative w-[clamp(3rem,6vw,8rem)] h-[clamp(3rem,6vw,8rem)] flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" style={{ animationDuration: '2s' }}></div>
          {/* Inner ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/60"></div>
          {/* Arrow */}
          <ArrowDown className="w-[clamp(1.5rem,3vw,4rem)] h-[clamp(1.5rem,3vw,4rem)] text-white animate-bounce" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>
    </div>
  );
}
