import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Image as ImageIcon, 
  FileText,
  LogOut,
  Menu
} from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Pages Content', path: '/admin/pages', icon: FileText },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Admins', path: '/admin/admins', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden relative">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'translate-x-0 w-[clamp(16rem,20vw,24rem)]' : '-translate-x-full md:translate-x-0 md:w-[clamp(5rem,6vw,8rem)]'} 
          fixed md:relative top-0 left-0 h-full bg-uhs-dark text-white transition-all duration-300 flex flex-col z-50 flex-shrink-0 shadow-2xl md:shadow-none`}
      >
        {/* Logo Area */}
        <div className="h-[clamp(4rem,6vw,8rem)] flex items-center justify-center border-b border-gray-700">
           <div className="flex items-center gap-[clamp(0.5rem,1vw,2rem)]">
             <img 
               src="https://res.cloudinary.com/dzpt7zwvf/image/upload/v1777059950/copy_of_screenshot_2026-04-25_010807_dyoqwf_e0435a.png" 
               alt="Logo" 
               className="w-[clamp(2.5rem,3vw,5rem)] h-[clamp(2.5rem,3vw,5rem)] object-contain rounded-full border border-uhs-orange/20 shadow-inner" 
             />
             {sidebarOpen && (
               <span className="font-heading font-black text-[clamp(0.875rem,1vw,2rem)] uppercase tracking-wider">
                 Admin
               </span>
             )}
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-[clamp(1rem,2vw,4rem)] overflow-y-auto">
          <ul className="space-y-[clamp(0.5rem,1vw,2rem)] px-[clamp(0.5rem,1vw,2rem)]">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className={`flex items-center p-[clamp(0.5rem,1vw,2rem)] rounded-lg transition-colors group relative ${isActive ? 'bg-uhs-maroon text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                  >
                    <item.icon className={`w-[clamp(1.25rem,2vw,3rem)] h-[clamp(1.25rem,2vw,3rem)] flex-shrink-0 ${isActive ? 'text-uhs-orange' : 'group-hover:text-uhs-orange transition-colors'}`} />
                    {sidebarOpen && <span className="ml-[clamp(0.5rem,1vw,2rem)] font-medium text-[clamp(0.875rem,1vw,2rem)] whitespace-nowrap">{item.name}</span>}
                    
                    {/* Tooltip for collapsed state */}
                    {!sidebarOpen && (
                      <div className="hidden md:block absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User / Logout */}
        <div className="p-[clamp(1rem,2vw,4rem)] border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center p-[clamp(0.5rem,1vw,2rem)] rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full group"
          >
            <LogOut className="w-[clamp(1.25rem,2vw,3rem)] h-[clamp(1.25rem,2vw,3rem)] group-hover:text-red-400 transition-colors" />
            {sidebarOpen && <span className="ml-[clamp(0.5rem,1vw,2rem)] font-medium text-[clamp(0.875rem,1vw,2rem)]">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        
        {/* Header */}
        <header className="h-[clamp(4rem,6vw,8rem)] bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-[clamp(1rem,2vw,4rem)] z-10 flex-shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-uhs-maroon focus:outline-none p-[clamp(0.5rem,1vw,2rem)] rounded-md hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-[clamp(1.5rem,2vw,4rem)] h-[clamp(1.5rem,2vw,4rem)]" />
            </button>

          </div>

          <div className="flex items-center gap-[clamp(1rem,2vw,4rem)]">

            
            <div className="flex items-center gap-[clamp(0.5rem,1vw,2rem)] border-l pl-[clamp(1rem,2vw,4rem)] border-gray-200">
              <div className="w-[clamp(2.5rem,3vw,5rem)] h-[clamp(2.5rem,3vw,5rem)] rounded-full bg-uhs-maroon text-white flex items-center justify-center font-bold text-[clamp(0.875rem,1vw,2rem)] border-[clamp(1px,0.2vw,4px)] border-uhs-orange/30 uppercase">
                {admin?.username.substring(0, 2) || 'SA'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[clamp(0.875rem,1vw,2rem)] font-bold text-gray-800">{admin?.username || 'Super Admin'}</p>
                <p className="text-[clamp(0.75rem,0.8vw,1.5rem)] text-gray-500 font-medium uppercase tracking-wider">{admin?.role.replace('_', ' ') || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-[clamp(1rem,2vw,6rem)]">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
