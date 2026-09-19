import React from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Hero({ onRoast }: { onRoast: (url: string) => void }) {
  const [url, setUrl] = React.useState('');

  const handleRoastSubmit = () => {
    if (!url.trim()) return;
    const lower = url.trim().toLowerCase();

    if (lower.includes('storeroast')) {
      toast("Nice try! I'm not dumb bro 😂 Try your product, not mine!", {
        icon: '💀',
        duration: 4000,
        style: {
          borderRadius: '16px',
          background: '#000',
          color: '#fff',
          fontWeight: 'bold',
          border: '2px solid #f7cd46',
        },
      });
      return;
    }

    if (lower.startsWith('http') || lower.includes('play.google.com') || lower.includes('apps.apple.com') || lower.includes('.')) {
      onRoast(url.trim());
    } else {
      toast.error("Please enter a valid App Store, Google Play, or Website URL.");
    }
  };

  return (
    <section
      className="w-full pt-32 pb-24 relative flex justify-center"
      style={{
        backgroundImage: "radial-gradient(circle at 15px 100%, transparent 10px, var(--primary-yellow) 10.5px)",
        backgroundSize: "30px 100%",
        backgroundRepeat: "repeat-x",
        backgroundColor: "transparent"
      }}
    >

      <div className="flex flex-col items-center text-center mt-12 max-w-4xl z-10 w-full px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative w-full"
        >
          <h1 className="text-5xl md:text-8xl font-handwriting font-bold tracking-tighter text-black leading-tight mb-6">
            Your first impression is <span className="bg-black text-white px-3 py-1 md:px-4 md:py-1 inline-block -rotate-2 shadow-xl align-middle mt-0">trash.</span>
          </h1>
          <div className="absolute -right-8 -top-8 rotate-12 hidden md:block opacity-60">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="red" strokeWidth="4" strokeLinecap="round">
              <path d="M20 80 Q 50 10 80 80 M70 60 L80 80 L95 55" />
            </svg>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-2xl md:text-3xl font-handwriting text-red-600 max-w-2xl leading-tight"
        >
          Brutally honest AI feedback for your App Store listing, Play Store listing, or website.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 w-full max-w-2xl relative"
        >

          <div className="relative flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-xl p-2 shadow-2xl border-4 border-black transition-transform w-full gap-2 md:gap-0">
            <div className="flex items-center flex-1 px-2 md:pl-4">
              <LinkIcon className="w-5 h-5 md:w-6 md:h-6 text-black mr-2 md:mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Paste App Store, Play Store, or Website URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRoastSubmit();
                  }
                }}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-black font-semibold placeholder-gray-400 text-sm md:text-xl py-2 md:py-0"
              />
            </div>
            <button
              onClick={handleRoastSubmit}
              className="bg-black text-white px-4 md:px-8 py-3 md:py-4 rounded-lg font-black text-sm md:text-lg uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-none border-2 border-transparent hover:border-white shrink-0 w-full md:w-auto md:ml-2"
            >
              Roast It
            </button>
          </div>
          <p className="mt-6 text-lg font-handwriting text-black/70">No sign-up required for basic, free, eww roasts.</p>

          <div className="absolute -left-16 top-1/2 -rotate-12 hidden md:block">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round">
              <path d="M80 50 Q 50 80 20 50 M15 35 L20 50 L35 45" />
            </svg>
            <span className="font-handwriting text-xl font-bold -ml-4 mt-2 block">Paste here!</span>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
