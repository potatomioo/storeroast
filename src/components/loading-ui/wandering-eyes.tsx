"use client";

import { motion } from "framer-motion";

export function WanderingEyes({ className }: { className?: string }) {
  const eyeVariants: any = {
    move: {
      x: ["-25%", "45%", "-40%", "25%", "0%"],
      y: ["-25%", "35%", "15%", "-35%", "0%"],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={`flex gap-6 justify-center items-center ${className || ''}`}>
      {/* Left Eye */}
      <div className="relative w-16 h-16 rounded-full bg-white border-[6px] border-black flex items-center justify-center overflow-hidden shadow-sm">
        <motion.div
          className="w-7 h-7 bg-black rounded-full absolute"
          variants={eyeVariants}
          animate="move"
        >
          {/* Catchlight */}
          <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1" />
        </motion.div>
      </div>
      
      {/* Right Eye */}
      <div className="relative w-16 h-16 rounded-full bg-white border-[6px] border-black flex items-center justify-center overflow-hidden shadow-sm">
        <motion.div
          className="w-7 h-7 bg-black rounded-full absolute"
          variants={eyeVariants}
          animate="move"
        >
          {/* Catchlight */}
          <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1" />
        </motion.div>
      </div>
    </div>
  );
}
