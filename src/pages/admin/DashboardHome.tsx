import { Users, Briefcase, MessageSquare, ImageIcon, Database, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function DashboardHome() {
  const { admins, services, messages, galleryImages, isApiConnected, isLoading, refresh } = useData();

  const stats = [
    { label: 'Total Admins', value: admins.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Services', value: services.filter(s => s.is_active).length, icon: Briefcase, color: 'bg-green-500' },
    { label: 'Unread Messages', value: messages.filter(m => !m.is_read).length, icon: MessageSquare, color: 'bg-uhs-orange' },
    { label: 'Gallery Images', value: galleryImages.length, icon: ImageIcon, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-[clamp(1.5rem,2vw,4rem)] max-w-[clamp(80rem,90vw,300rem)] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-[clamp(1.5rem,2vw,4rem)] font-bold text-gray-800">Dashboard Overview</h1>
        <button onClick={refresh} className="flex items-center gap-[clamp(0.5rem,1vw,2rem)] text-[clamp(0.875rem,1vw,2rem)] font-medium text-gray-500 hover:text-uhs-maroon transition-colors bg-white px-[clamp(1rem,2vw,4rem)] py-[clamp(0.5rem,1vw,2rem)] rounded-lg shadow-sm border border-gray-200">
          <RefreshCw className={`w-[clamp(1rem,1.5vw,3rem)] h-[clamp(1rem,1.5vw,3rem)] ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* API Connection Status Banner */}
      <div className={`rounded-xl px-[clamp(1rem,2vw,4rem)] py-[clamp(0.75rem,1.5vw,3rem)] flex items-center gap-[clamp(0.75rem,1.5vw,3rem)] text-[clamp(0.875rem,1vw,2rem)] font-medium shadow-sm border ${isApiConnected ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
        <Database className="w-[clamp(1.25rem,2vw,4rem)] h-[clamp(1.25rem,2vw,4rem)] flex-shrink-0" />
        {isApiConnected
          ? '✅ Live — Connected to MySQL database via Node.js API. All changes are persisted in real time.'
          : '⚠️ Offline — Backend API not reachable. Run `cd backend && npm run dev` to connect. Changes are saved locally for now.'}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 4xl:grid-cols-6 6xl:grid-cols-8 gap-[clamp(1rem,2vw,6rem)]">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-[clamp(0.5rem,1vw,2rem)] shadow-sm p-[clamp(1rem,2vw,4rem)] border border-gray-100 flex items-center transform hover:-translate-y-1 transition-transform duration-300">
            <div className={`p-[clamp(0.5rem,1vw,2rem)] rounded-lg text-white ${stat.color} shadow-lg`}>
              <stat.icon className="w-[clamp(1.5rem,2vw,4rem)] h-[clamp(1.5rem,2vw,4rem)]" />
            </div>
            <div className="ml-[clamp(1rem,2vw,4rem)]">
              <p className="text-[clamp(0.75rem,1vw,2rem)] font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-[clamp(1.5rem,2.5vw,6rem)] font-bold text-gray-800 mt-[clamp(0.25rem,0.5vw,1rem)] leading-none">{isLoading ? '…' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-uhs-maroon to-red-900 rounded-[clamp(0.5rem,1vw,2rem)] shadow-md p-[clamp(1.5rem,3vw,8rem)] text-white relative overflow-hidden mt-[clamp(2rem,4vw,8rem)]">
        <div className="relative z-10">
          <h2 className="text-[clamp(1.5rem,3vw,8rem)] font-heading font-black mb-[clamp(0.5rem,1vw,2rem)]">Welcome, Admin!</h2>
          <h2 className="text-[clamp(1.5rem,3vw,8rem)] font-heading font-black mb-[clamp(0.5rem,1vw,2rem)]">IIT Bombay</h2>
          <p className="max-w-[clamp(30rem,40vw,80rem)] text-red-100 text-[clamp(1rem,1.5vw,4rem)] leading-relaxed">
            Manage your website content, respond to messages, and update the gallery. Changes reflect on the public site instantly.
          </p>
        </div>
        {/* Decorative background logo */}
        <div className="absolute -right-10 -bottom-20 opacity-10 pointer-events-none">
          <div className="w-[clamp(10rem,20vw,40rem)] h-[clamp(10rem,20vw,40rem)] bg-white rounded-full flex items-center justify-center font-bold text-[clamp(5rem,10vw,20rem)]">UHS</div>
        </div>
      </div>
    </div>
  );
}
