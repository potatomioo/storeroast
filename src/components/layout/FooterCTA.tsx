import React from 'react';

export default function FooterCTA() {
  return (
    <section className="mt-32 w-full max-w-4xl relative overflow-hidden rounded-[2.5rem] p-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
      <div className="bg-white w-full h-full rounded-[2.3rem] py-16 px-8 text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Stop bleeding users.</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-10">
          Get a comprehensive AI audit of your app store presence delivered in seconds.
        </p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg"
        >
          Start Your Free Roast
        </button>
      </div>
    </section>
  );
}
