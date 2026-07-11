import React from 'react';

export default function Pricing({ onBuy, isLoggedIn }: { onBuy?: () => void, isLoggedIn?: boolean }) {
  return (
    <section id="pricing" className="mt-32 w-full max-w-5xl flex flex-col items-center">
      <h2 className="text-3xl font-bold tracking-tight mb-2">Simple, brutal pricing.</h2>
      <p className="text-gray-500 mb-12">No subscriptions. No monthly fees. Just pure actionable insight.</p>
      
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Free Tier */}
        <div className="border border-gray-200 rounded-3xl p-8 flex flex-col bg-white">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Free Teaser</h3>
          <div className="text-4xl font-bold mb-6">$0</div>
          <ul className="space-y-4 flex-1 mb-8">
            <li className="flex items-center gap-3 text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-black"/> Title Analysis</li>
            <li className="flex items-center gap-3 text-gray-600"><div className="w-1.5 h-1.5 rounded-full bg-black"/> Description Roast</li>
            <li className="flex items-center gap-3 text-gray-400"><div className="w-1.5 h-1.5 rounded-full bg-gray-200"/> Screenshots Analysis (Locked)</li>
            <li className="flex items-center gap-3 text-gray-400"><div className="w-1.5 h-1.5 rounded-full bg-gray-200"/> Reviews Sentiment (Locked)</li>
            <li className="flex items-center gap-3 text-gray-400"><div className="w-1.5 h-1.5 rounded-full bg-gray-200"/> "Fix Today" Action Plan (Locked)</li>
          </ul>
        </div>

        {/* Paid Tier */}
        <div className="border border-purple-200 rounded-3xl p-8 flex flex-col bg-gradient-to-b from-purple-50/50 to-white relative shadow-xl">
          <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Full Roast</h3>
          <div className="flex items-end gap-1 mb-6">
            <div className="text-4xl font-bold">$1.99</div>
            <div className="text-gray-500 font-medium mb-1">/ app</div>
          </div>
          <ul className="space-y-4 flex-1 mb-8">
            <li className="flex items-center gap-3 text-gray-900 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Everything in Free</li>
            <li className="flex items-center gap-3 text-gray-900"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Screenshots Analysis</li>
            <li className="flex items-center gap-3 text-gray-900"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Reviews Sentiment</li>
            <li className="flex items-center gap-3 text-gray-900"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> "Fix Today" Action Plan</li>
          </ul>
          {onBuy && (
            <button 
              onClick={onBuy}
              className="w-full bg-black text-white rounded-xl py-3.5 font-bold hover:bg-gray-800 transition-colors shadow-lg"
            >
              {isLoggedIn ? 'Buy 1 Credit ($0.01 Test)' : 'Sign In to Buy'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
