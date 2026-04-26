import { ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function QuickLinksTab() {
  const { services } = useData();
  const activeServices = services.filter(s => s.is_active).sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 hidden md:flex items-center group cursor-pointer">
      <div className="bg-uhs-maroon text-white py-8 3xl:py-12 4xl:py-16 px-2 3xl:px-4 4xl:px-6 rounded-r-lg 4xl:rounded-r-2xl flex flex-col items-center justify-center border-l-4 4xl:border-l-8 border-uhs-orange shadow-2xl transition-all duration-300">
        <span 
          className="font-heading font-bold text-xs 3xl:text-xl 4xl:text-3xl tracking-[0.2em] uppercase" 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Quick Links
        </span>
      </div>
      <div className="bg-uhs-orange text-white p-2 3xl:p-4 4xl:p-6 rounded-r-lg 4xl:rounded-r-2xl opacity-0 transform -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 shadow-lg relative">
        <ChevronRight className="w-5 h-5 3xl:w-8 3xl:h-8 4xl:w-12 4xl:h-12" />
      </div>
      
      {/* Slide-out Menu */}
      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-white shadow-2xl rounded-lg overflow-hidden w-64 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 translate-x-4 group-hover:translate-x-0">
        <div className="bg-uhs-maroon text-white font-bold p-4 border-b border-uhs-orange">
          Services
        </div>
        <ul className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
          {activeServices.length > 0 ? (
            activeServices.map(service => (
              <li key={service.id}>
                <a href={`#${service.slug}`} className="block p-4 hover:bg-orange-50 hover:text-uhs-orange transition-colors">
                  <div className="font-bold text-gray-800 text-sm">{service.title}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{service.short_description}</div>
                </a>
              </li>
            ))
          ) : (
            <li className="p-4 text-sm text-gray-500 italic">No services available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
