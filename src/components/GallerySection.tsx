import { useData } from '../context/DataContext';
import { Clock } from 'lucide-react';

// Helper to format date strings like "2026-04-24 22:44:52" into "Apr 24, 2026"
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr.split(' ')[0]; // Fallback if invalid
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

export default function GallerySection() {
  const { galleryImages, isLoading } = useData();

  if (!isLoading && galleryImages.length === 0) return null;

  // We group images into chunks of 5 for the collage blocks (1 large vertical, 4 small in 2x2 grid).
  const collageBlocks = [];
  
  // Ensure we have enough images to form a few blocks
  let pool = [...galleryImages];
  if (pool.length > 0) {
    while (pool.length < 15) {
      pool = [...pool, ...galleryImages];
    }
  }

  for (let i = 0; i < pool.length; i += 5) {
    if (i + 4 < pool.length) {
      collageBlocks.push([pool[i], pool[i+1], pool[i+2], pool[i+3], pool[i+4]]);
    }
  }

  // Duplicate the base set of collage blocks to ensure a smooth, seamless infinite loop
  let baseSet = [...collageBlocks];
  if (baseSet.length > 0) {
    while (baseSet.length < 4) {
      baseSet = [...baseSet, ...collageBlocks];
    }
  }

  const animationDuration = `${baseSet.length * 15}s`;

  return (
    <section id="gallery" className="pt-[clamp(1rem,3vw,6rem)] pb-[clamp(3rem,8vw,16rem)] bg-white overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 mb-[clamp(2rem,6vw,12rem)] flex justify-center text-center">
        <h2 className="text-[clamp(2.5rem,5vw,10rem)] font-heading font-black text-uhs-maroon uppercase tracking-tight relative group inline-block cursor-pointer transition-transform duration-300 hover:-translate-y-2">
          GALLERY
          <span className="absolute -bottom-2 left-0 w-full h-[clamp(4px,0.5vw,12px)] bg-uhs-maroon scale-x-100 group-hover:scale-x-0 transition-transform duration-300 origin-left"></span>
        </h2>
      </div>

      {/* Reverse Infinite Marquee Container */}
      <div className="flex overflow-hidden w-full group relative pt-4 pb-8">
        {isLoading ? (
          <div className="flex gap-[clamp(1rem,2vw,4rem)] px-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-[clamp(1rem,2vw,4rem)] w-[clamp(40rem,80vw,120rem)] h-[clamp(25rem,45vw,70rem)] shrink-0 animate-pulse bg-gray-100 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="flex whitespace-nowrap animate-marquee-reverse w-max gap-[clamp(1rem,2vw,4rem)] pr-[clamp(1rem,2vw,4rem)]" style={{ animationDuration }}>
            {[...baseSet, ...baseSet].map((block, index) => {
              const [img1, img2, img3, img4, img5] = block;
              return (
                <div key={index} className="flex gap-[clamp(1rem,2vw,4rem)] w-[clamp(40rem,80vw,120rem)] h-[clamp(25rem,45vw,70rem)] shrink-0">
                  {/* Left: Vertical Single Image */}
                  <div className="w-[40%] h-full rounded-[clamp(0.5rem,1vw,2rem)] overflow-hidden relative group/img cursor-pointer transition-all">
                    <img 
                      src={img1?.image_url} 
                      alt={img1?.alt_text || img1?.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" 
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Text Content */}
                    <div className="absolute bottom-[clamp(1rem,3vw,6rem)] left-[clamp(1rem,3vw,6rem)] right-[clamp(1rem,3vw,6rem)] text-white text-left whitespace-normal z-10">
                       <div className="flex items-center text-white/90 text-[clamp(0.75rem,1vw,2rem)] mb-[clamp(0.5rem,1vw,2rem)] font-medium">
                         <Clock className="w-[clamp(1rem,1.5vw,3rem)] h-[clamp(1rem,1.5vw,3rem)] mr-[clamp(0.25rem,0.5vw,1rem)]" />
                         {formatDate(img1?.created_at) || 'Recent'}
                       </div>
                       <h3 className="text-[clamp(1.5rem,3vw,5rem)] font-black uppercase font-heading leading-[1.1]">{img1?.title || 'Gallery Image'}</h3>
                    </div>
                  </div>
                  
                  {/* Right: 2x2 Grid for 4 small images */}
                  <div className="w-[60%] h-full grid grid-cols-2 grid-rows-2 gap-[clamp(1rem,2vw,4rem)]">
                    {[img2, img3, img4, img5].map((img, i) => (
                      <div key={i} className="w-full h-full rounded-[clamp(0.5rem,1vw,2rem)] overflow-hidden relative group/img cursor-pointer transition-all">
                        <img 
                          src={img?.image_url} 
                          alt={img?.alt_text || img?.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-[clamp(0.5rem,1.5vw,3rem)] left-[clamp(0.5rem,1.5vw,3rem)] right-[clamp(0.5rem,1.5vw,3rem)] text-white text-left whitespace-normal z-10">
                           <div className="flex items-center text-white/90 text-[clamp(0.65rem,0.8vw,1.5rem)] mb-[clamp(0.25rem,0.5vw,1rem)] font-medium">
                             <Clock className="w-[clamp(0.8rem,1vw,2rem)] h-[clamp(0.8rem,1vw,2rem)] mr-[clamp(0.25rem,0.5vw,1rem)]" />
                             {formatDate(img?.created_at) || 'Recent'}
                           </div>
                           <h3 className="text-[clamp(1rem,1.5vw,3rem)] font-black uppercase font-heading leading-tight line-clamp-2">{img?.title || 'Gallery Image'}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Embedded Style for Reverse Marquee */}
      <style>{`
        @keyframes marquee-reverse-custom {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-reverse {
          animation: marquee-reverse-custom linear infinite;
        }
      `}</style>
    </section>
  );
}
