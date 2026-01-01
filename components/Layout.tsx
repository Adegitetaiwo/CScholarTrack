
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Files, 
  GraduationCap,
  Settings as SettingsIcon,
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  username: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout, username }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Applications', path: '/applications', icon: GraduationCap },
    { name: 'New Application', path: '/new', icon: PlusCircle },
    { name: 'Document Library', path: '/documents', icon: Files },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CScholarTrack</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Logout</span>
          </button>
          
          <div className="mt-4 p-4 bg-slate-800 rounded-2xl">
            <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-widest">Active User</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold">
                {username.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-medium truncate">{username}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeMenu} />
          <nav className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 text-white p-6 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold">CScholarTrack</span>
              </div>
              <button onClick={closeMenu} className="p-2 text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={closeMenu}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                      isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-bold">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <button 
              onClick={() => { onLogout(); closeMenu(); }}
              className="flex items-center gap-4 px-4 py-4 text-rose-400 hover:bg-slate-800 rounded-2xl transition-all"
            >
              <LogOut className="w-6 h-6" />
              <span className="font-bold">Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <GraduationCap className="w-7 h-7 text-blue-600" />
          </div>
          
          <div className="flex-1 flex justify-center md:justify-start">
            <h1 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">
              {location.pathname === '/' ? 'Overview' : 
               location.pathname.split('/').filter(Boolean)[0]?.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{username}</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase">Candidate</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 text-xs font-bold">
                {username.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
