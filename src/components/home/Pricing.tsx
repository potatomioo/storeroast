import React from 'react';
import { Check, X } from 'lucide-react';

export default function Pricing({ onBuy, isLoggedIn }: { onBuy?: () => void, isLoggedIn?: boolean }) {
  return (
    <section id="pricing" className="mt-20 mx-auto w-full max-w-5xl flex flex-col items-center px-4">
      
      {/* Centered Minimal Pricing Cards */}
      <div className="flex flex-col md:flex-row justify-center gap-8 w-full max-w-3xl mb-32">
        
        {/* Free Card */}
        <div className="border border-gray-200 rounded-[2rem] p-8 flex flex-col bg-[#fcfcfc] flex-1 max-w-sm">
          <div className="text-[10px] font-bold tracking-widest uppercase bg-gray-200 px-3 py-1 rounded-md w-fit mb-6 text-gray-500">CURRENT PLAN</div>
          <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight font-handwriting">A Gentle Slap</h3>
          <p className="text-sm text-gray-500 mb-8 font-medium">A tiny taste of reality. Discover one glaring reason why your conversion rate is garbage.</p>
          
          <div className="flex items-end gap-1 mb-8">
            <div className="text-6xl font-black tracking-tighter font-handwriting">$0</div>
            <div className="text-sm text-gray-500 font-bold mb-2">/forever</div>
          </div>
          
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-center gap-3 text-sm font-medium text-gray-700"><Check className="w-4 h-4 text-gray-900" /> 1 Surface-Level Roast</li>
            <li className="flex items-center gap-3 text-sm font-medium text-gray-700"><Check className="w-4 h-4 text-gray-900" /> Basic Explanations</li>
            <li className="flex items-center gap-3 text-sm font-medium text-gray-400 line-through decoration-gray-300"><X className="w-4 h-4 text-gray-400" /> Visual & Screenshot Analysis</li>
            <li className="flex items-center gap-3 text-sm font-medium text-gray-400 line-through decoration-gray-300"><X className="w-4 h-4 text-gray-400" /> Competitor Benchmarking</li>
          </ul>

          <button disabled className="w-full border-2 border-gray-900 text-gray-900 rounded-lg py-3.5 font-bold text-sm bg-transparent">
            Active (You Cheapskate)
          </button>
        </div>

        {/* Paid Card */}
        <div className="border-4 border-black rounded-[2rem] p-8 flex flex-col bg-[var(--primary-yellow)] flex-1 max-w-sm shadow-2xl relative rotate-1 hover:rotate-0 transition-transform">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-sm">
            THE DEEP ROAST
          </div>
          <div className="text-[10px] font-bold tracking-widest uppercase bg-white text-black px-3 py-1 rounded-md w-fit mb-6 shadow-sm">PREMIUM</div>
          <h3 className="text-3xl font-black text-black mb-2 tracking-tight font-handwriting">Total Obliteration</h3>
          <p className="text-sm text-black/70 mb-8 font-medium">Stop guessing why users bounce. Unlock the brutally honest truth and 10 full roasts.</p>
          
          <div className="flex items-end gap-1 mb-8 text-black">
            <div className="text-6xl font-black tracking-tighter font-handwriting">$1.99</div>
            <div className="text-sm font-bold mb-2">/one-time</div>
          </div>
          
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-center gap-3 text-sm font-bold text-black"><Check className="w-4 h-4 text-black" /> 10 Full Deep Roasts</li>
            <li className="flex items-center gap-3 text-sm font-bold text-black"><Check className="w-4 h-4 text-black" /> Visual Screenshot Evidence</li>
            <li className="flex items-center gap-3 text-sm font-bold text-black"><Check className="w-4 h-4 text-black" /> Competitor Benchmarking</li>
            <li className="flex items-center gap-3 text-sm font-bold text-black"><Check className="w-4 h-4 text-black" /> Expanded Brutal Explanations</li>
          </ul>

          {onBuy && (
            <button 
              onClick={onBuy}
              className="w-full bg-black text-white rounded-lg py-4 font-black text-sm uppercase tracking-wider hover:bg-gray-800 transition-transform shadow-lg"
            >
              {isLoggedIn ? 'Buy 10 Credits ($1.99)' : 'Sign In to Buy'}
            </button>
          )}
        </div>
      </div>

      {/* Surgical Breakdown Table */}
      <div className="w-full max-w-4xl flex flex-col items-center">
        <h2 className="text-4xl font-black tracking-tight mb-16 text-gray-900">Surgical Breakdown</h2>
        
        <div className="w-full border-t-2 border-gray-900">
          
          <div className="grid grid-cols-3 py-6 border-b border-gray-200">
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 col-span-1">Diagnostic Feature</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 text-center">Free</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-900 text-center">The Deep Burn</div>
          </div>

          <div className="grid grid-cols-3 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="text-sm font-bold text-gray-900 col-span-1 flex items-center">Turnaround Time</div>
            <div className="text-sm font-medium text-gray-500 text-center flex items-center justify-center">Instant</div>
            <div className="text-sm font-black text-gray-900 text-center flex items-center justify-center">Instant</div>
          </div>

          <div className="grid grid-cols-3 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="text-sm font-bold text-gray-900 col-span-1 flex items-center">UX Assessment Severity</div>
            <div className="text-sm font-medium text-gray-500 text-center flex items-center justify-center">Basic</div>
            <div className="text-sm font-black text-gray-900 text-center flex items-center justify-center">Brutal & Comprehensive</div>
          </div>

          <div className="grid grid-cols-3 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="text-sm font-bold text-gray-900 col-span-1 flex items-center">Actionable Recovery Checklist</div>
            <div className="text-center flex items-center justify-center"><X className="w-5 h-5 text-gray-300" /></div>
            <div className="text-center flex items-center justify-center"><Check className="w-5 h-5 text-gray-900" /></div>
          </div>

          <div className="grid grid-cols-3 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="text-sm font-bold text-gray-900 col-span-1 flex items-center">Competitor Benchmarking</div>
            <div className="text-center flex items-center justify-center"><X className="w-5 h-5 text-gray-300" /></div>
            <div className="text-center flex items-center justify-center"><Check className="w-5 h-5 text-gray-900" /></div>
          </div>

        </div>
      </div>

    </section>
  );
}
