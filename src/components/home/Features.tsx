import React from 'react';
import { motion } from 'framer-motion';
import { Eye, PenLine, MessageSquareQuote, CheckCircle2, ScanSearch } from 'lucide-react';

export default function Features() {
  return (
    <>
      {/* Main Feature Showcase - Wall of Flame */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mt-12 mx-auto w-[calc(100%-2rem)] max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-50/50 rounded-3xl p-6 lg:p-16 border border-gray-100 mb-12"
      >
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">Wall of Flame</h2>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            The lucky founders who survived the roast. Some fixed their products. Some fixed their egos. Some did both.
          </p>

          <div className="mt-8 flex gap-4">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl shadow-black/5 border border-gray-100 flex-1">
              <div className="text-xs md:text-sm font-medium text-gray-400 mb-1">Before Roast</div>
              <div className="text-xl md:text-2xl font-black text-gray-900 opacity-50 line-through">Average</div>
            </div>
            <div className="bg-[var(--primary-yellow)] rounded-2xl p-4 md:p-6 shadow-xl shadow-yellow-500/20 border border-yellow-400 flex-1">
              <div className="text-xs md:text-sm font-medium text-gray-800 mb-1">After Roast</div>
              <div className="text-xl md:text-2xl font-black text-black leading-tight">Unfair Advantage</div>
            </div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 h-full min-h-[260px] md:min-h-[280px] flex items-center justify-center py-8">
          {/* Testimonial 1 */}
          <div className="absolute top-4 md:top-8 right-0 bg-white p-4 md:p-5 rounded-2xl shadow-xl w-[90%] border border-gray-100 z-10 rotate-2 hover:rotate-0 transition-transform">
            <p className="text-gray-600 font-medium italic">
              "I laughed for five minutes after reading. Then I redesigned screenshots."
            </p>
          </div>

          {/* Survivor Badge */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-black text-white p-4 md:p-5 rounded-2xl shadow-2xl z-20 -rotate-3 hover:rotate-0 transition-transform">
            <div className="text-2xl font-black italic tracking-tight mb-1">SURVIVOR</div>
            <div className="text-xs text-gray-400 font-medium">App Store Rank #4 (FinTech)</div>
          </div>

          {/* Testimonial 2 */}
          <div className="absolute bottom-4 md:bottom-8 left-8 bg-white p-4 md:p-5 rounded-2xl shadow-xl w-[85%] border border-gray-100 z-10 -rotate-2 hover:rotate-0 transition-transform">
            <div className="flex text-yellow-400 mb-3 text-sm">
              ★★★★★
            </div>
            <p className="text-gray-900 font-bold">"The only roasting tool, i laughed over."</p>
          </div>
        </div>
      </motion.section>
    </>
  );
}
