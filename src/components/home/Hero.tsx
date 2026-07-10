import React from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon } from 'lucide-react';

export default function Hero({ onRoast }: { onRoast: (url: string) => void }) {
  const [url, setUrl] = React.useState('');

  return (
    <section className="flex flex-col items-center text-center mt-20 max-w-4xl z-10 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-600 mb-8"
      >
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        AI-POWERED OPTIMIZATION
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 leading-[1.1]"
      >
        Your app listing is losing downloads. <span className="text-gray-500">Find out why.</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl font-light"
      >
        StoreRoast uses sophisticated visual and linguistic analysis to critique your App Store or Play Store listing with surgical precision.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 w-full max-w-2xl relative"
      >
        {/* Permanent glow effect */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-30 blur transition duration-500" />
        
        <div className="relative flex items-center bg-white rounded-full p-2 pl-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <LinkIcon className="w-5 h-5 text-gray-400 mr-3" />
          <input 
            type="text"
            placeholder="Paste App Store or Google Play URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-base"
          />
          <button 
            onClick={() => {
              if (url) onRoast(url);
            }}
            className="bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
          >
            Roast My App
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-400 font-medium">No sign-up required for your first free roast.</p>
      </motion.div>
    </section>
  );
}
