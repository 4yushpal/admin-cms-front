import { useData } from '../context/DataContext';

export default function ValuesSection() {
  const { pageContent, galleryImages } = useData();

  // Extract all core values dynamically from pageContent
  // We look for any keys matching value_N_title
  const valueIndices = Array.from(new Set(
    pageContent
      .filter(p => p.section_key.startsWith('value_') && p.section_key.endsWith('_title'))
      .map(p => p.section_key.split('_')[1])
  )).sort((a, b) => parseInt(a) - parseInt(b));

  const values = valueIndices.map((idx, index) => {
    const title = pageContent.find(p => p.section_key === `value_${idx}_title`)?.content_value || `Value ${idx}`;
    const text = pageContent.find(p => p.section_key === `value_${idx}_text`)?.content_value || '';
    
    // Use gallery images categorized as 'Students' or 'Campus' for values, or just sequence through all gallery images
    const image = galleryImages[index % galleryImages.length]?.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000';
    
    return { title, text, image };
  });

  return (
    <section className="py-[clamp(3rem,8vw,20rem)] bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[clamp(16rem,25vw,80rem)] h-[clamp(16rem,25vw,80rem)] bg-uhs-light rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[clamp(24rem,35vw,100rem)] h-[clamp(24rem,35vw,100rem)] bg-uhs-orange/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-[clamp(1rem,3vw,12rem)] relative z-10 max-w-full">
        <div className="text-center mb-[clamp(2.5rem,6vw,16rem)] relative">
          <span className="text-uhs-orange font-heading font-bold tracking-[0.2em] xs:tracking-[0.3em] uppercase text-[clamp(0.75rem,1.5vw,4rem)] block mb-[clamp(0.5rem,1.5vw,4rem)]">The Underdale Difference</span>
          <h2 className="text-[clamp(2rem,5vw,12rem)] font-heading font-black text-uhs-maroon uppercase tracking-tight">Core Values</h2>
          <div className="w-[clamp(4rem,10vw,24rem)] h-[clamp(4px,0.5vw,16px)] bg-gradient-to-r from-uhs-maroon to-uhs-orange mx-auto mt-[clamp(1rem,3vw,8rem)] rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 5xl:grid-cols-5 6xl:grid-cols-6 gap-[clamp(2rem,5vw,16rem)] max-w-full 3xl:max-w-[120rem] 4xl:max-w-[180rem] 5xl:max-w-[240rem] 6xl:max-w-[320rem] mx-auto px-4 xs:px-0">
          {values.map((value, index) => (
            <div key={index} className="flex flex-col items-center group cursor-pointer w-full">
              {/* U Shape Mask */}
              <div className="w-full max-w-[clamp(16rem,20vw,40rem)] aspect-[4/5] relative overflow-hidden rounded-t-sm rounded-b-[clamp(6rem,12vw,24rem)] shadow-[0_20px_40px_rgb(0,0,0,0.1)] group-hover:shadow-[0_20px_40px_rgba(128,0,32,0.2)] transition-all duration-500 transform group-hover:-translate-y-[clamp(0.5rem,1vw,2rem)] border-b-[clamp(4px,1vw,24px)] border-uhs-maroon group-hover:border-uhs-orange bg-gray-100">
                <img 
                  src={value.image} 
                  alt={value.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-uhs-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="absolute bottom-[clamp(1rem,3vw,6rem)] left-0 right-0 text-center">
                   <div className="w-[clamp(2rem,4vw,8rem)] h-[clamp(4px,0.5vw,12px)] bg-uhs-orange mx-auto mb-[clamp(0.5rem,1vw,2rem)] transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </div>
              </div>
              <h3 className="mt-[clamp(1.5rem,3vw,8rem)] text-[clamp(1.125rem,2vw,6rem)] font-heading font-bold text-uhs-dark uppercase tracking-[0.1em] xs:tracking-[0.15em] group-hover:text-uhs-maroon transition-colors text-center">
                {value.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
