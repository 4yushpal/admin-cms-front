import { ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function NewsEvents() {
  const { galleryImages } = useData();
  
  // Use only gallery images categorized as 'Events' for news
  const newsItems = galleryImages
    .filter(g => g.category === 'Events')
    .map(g => ({ 
      title: g.title || 'UHS Event', 
      date: g.created_at ? g.created_at.split(' ')[0] : 'Recently', 
      image: g.image_url 
    }));

  if (newsItems.length === 0) return null; // Or show a placeholder if desired

  return (
    <section className="py-[clamp(3rem,8vw,20rem)] bg-uhs-light">
      <div className="container mx-auto px-[clamp(1rem,3vw,12rem)] max-w-full 3xl:max-w-[120rem] 4xl:max-w-[180rem] 5xl:max-w-[240rem] 6xl:max-w-[320rem]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[clamp(2rem,6vw,12rem)]">
          <div>
            <h2 className="text-[clamp(1.5rem,4vw,10rem)] font-heading font-black text-uhs-dark uppercase tracking-tight break-words">Latest News & Events</h2>
            <div className="w-[clamp(4rem,10vw,20rem)] h-[clamp(4px,0.5vw,16px)] bg-uhs-orange mt-[clamp(0.5rem,1.5vw,4rem)] rounded-full"></div>
          </div>
          <a href="#" className="hidden md:flex items-center gap-[clamp(0.5rem,1vw,2rem)] text-uhs-maroon font-bold tracking-widest uppercase hover:text-uhs-orange transition-colors group mt-[clamp(1.5rem,3vw,6rem)] md:mt-0 text-[clamp(1rem,1.5vw,3.5rem)]">
            <span>View All News</span>
            <ArrowRight className="w-[clamp(1.25rem,2vw,4rem)] h-[clamp(1.25rem,2vw,4rem)] group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 5xl:grid-cols-5 6xl:grid-cols-6 gap-[clamp(1.5rem,3vw,12rem)]">
          {newsItems.map((item, index) => (
            <div key={index} className="bg-white rounded-[clamp(0.5rem,1vw,2rem)] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
              <div className="relative h-[clamp(12rem,20vw,40rem)] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-[clamp(0.75rem,2vw,4rem)] left-[clamp(0.75rem,2vw,4rem)] bg-uhs-maroon text-white text-[clamp(0.65rem,1vw,2.5rem)] font-bold px-[clamp(0.5rem,1.5vw,4rem)] py-[clamp(0.25rem,0.5vw,2rem)] uppercase tracking-wider rounded-sm shadow-md">
                  {item.date}
                </div>
              </div>
              <div className="p-[clamp(1rem,2vw,8rem)] flex flex-col flex-grow">
                <h3 className="text-[clamp(1rem,1.5vw,4rem)] font-heading font-bold text-uhs-dark leading-snug mb-[clamp(0.75rem,1.5vw,4rem)] group-hover:text-uhs-maroon transition-colors line-clamp-3">
                  {item.title}
                </h3>
                <div className="mt-auto pt-[clamp(1rem,2vw,6rem)] border-t border-gray-100">
                  <a href="#" className="inline-flex items-center gap-[clamp(0.5rem,1vw,2rem)] text-uhs-orange font-bold uppercase tracking-wider text-[clamp(0.75rem,1vw,2.5rem)] group/btn hover:text-uhs-maroon transition-colors">
                    <span>Read More</span>
                    <ArrowRight className="w-[clamp(1rem,1.5vw,3rem)] h-[clamp(1rem,1.5vw,3rem)] group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(2rem,4vw,8rem)] text-center md:hidden">
          <a href="#" className="inline-flex items-center gap-[clamp(0.5rem,1vw,2rem)] text-uhs-maroon font-bold tracking-widest uppercase hover:text-uhs-orange transition-colors border-2 border-uhs-maroon px-[clamp(1rem,3vw,6rem)] py-[clamp(0.5rem,1.5vw,3rem)] rounded-md text-[clamp(0.875rem,2vw,3rem)]">
            <span>View All News</span>
            <ArrowRight className="w-[clamp(1rem,1.5vw,3rem)] h-[clamp(1rem,1.5vw,3rem)]" />
          </a>
        </div>
      </div>
    </section>
  );
}
