import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  "Reading your description...",
  "Counting how many times you said 'easy to use'...",
  "Judging your screenshots...",
  "Reading your 2-star reviews...",
  "Preparing the roast... 🔥",
  "Almost there, the AI is being extra brutal...",
];

export default function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] z-10">
      <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-purple-500 animate-spin mb-8" />
      <div className="h-12 relative overflow-hidden w-full max-w-md flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-xl font-medium text-gray-700 text-center absolute"
          >
            ⏳ {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
