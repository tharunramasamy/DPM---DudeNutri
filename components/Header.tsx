
import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onReset }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center gap-3 group cursor-default">
        <div className="w-10 h-10 dude-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 group-hover:rotate-6 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black tracking-tighter text-slate-900 italic">
          DudeNutri
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Bro</p>
          <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
        </div>
        
        <div className="flex items-center gap-1.5 bg-slate-50/50 p-1 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm bg-white ring-2 ring-white hidden xs:block">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=b6e3f4`} 
              alt="avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 bg-white text-red-500 font-bold text-xs rounded-xl shadow-sm hover:bg-red-50 transition-all border border-slate-100 active:scale-95"
            title="Logout"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2.5" 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
