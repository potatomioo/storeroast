import React from 'react';
import { LogOut, Coins } from 'lucide-react';

export default function Header({ session, credits, onLogout, onGetStarted }: { session?: any, credits?: number, onLogout?: () => void, onGetStarted?: () => void }) {
  return (
    <header className="w-full max-w-6xl py-8 px-6 flex items-center justify-between z-10">
      <div className="font-bold text-2xl tracking-tight cursor-pointer" onClick={() => window.location.reload()}>StoreRoast</div>
      
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
        </nav>

        {session ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2 rounded-full font-bold text-sm shadow-sm">
              <Coins className="w-4 h-4 text-yellow-500" />
              {credits} Credits
            </div>
            <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button onClick={onGetStarted} className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition-transform">
            Get Started
          </button>
        )}
      </div>
    </header>
  );
}
