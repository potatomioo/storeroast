import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WanderingEyes } from "@/components/loading-ui/wandering-eyes";

const MESSAGES = [
  { text: "Judging your color palette...", highlight: "color palette" },
  { text: "Finding every typo you missed...", highlight: "missed" },
  { text: "Questioning your life choices...", highlight: "life choices" },
  { text: "Calculating the exact moment users bounce...", highlight: "bounce" },
  { text: "Preparing the brutal truth...", highlight: "brutal truth" },
];

export default function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const msg = MESSAGES[index];
  const parts = msg.text.split(msg.highlight);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] z-10 p-4">
      <WanderingEyes className="h-20 w-[180px] mb-8" />
      <div className="h-16 relative overflow-visible w-full max-w-lg flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="text-2xl md:text-3xl font-handwriting font-bold text-gray-500 text-center absolute leading-relaxed"
          >
            {parts[0]}
            <span className="bg-[var(--primary-yellow)] text-black px-2 py-0.5 mx-1 font-black shadow-sm -rotate-2 inline-block">
              {msg.highlight}
            </span>
            {parts[1]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
