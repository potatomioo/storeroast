import React from 'react';
import { motion } from 'framer-motion';
import { Eye, PenLine, MessageSquareQuote, CheckCircle2, ScanSearch } from 'lucide-react';

export default function Features() {
  return (
    <>
      {/* Main Feature Showcase */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mt-32 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-50/50 rounded-3xl p-8 lg:p-16 border border-gray-100"
      >
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 z-0" />
          <div className="relative z-10 w-full aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200/50 overflow-hidden">
             {/* Mock UI graphic representing precision analysis */}
             <div className="w-[80%] h-[70%] bg-[#111] rounded-xl shadow-2xl p-4 flex flex-col gap-3">
                <div className="h-4 w-1/3 bg-gray-700 rounded" />
                <div className="flex gap-4 mt-2">
                   <div className="w-12 h-12 rounded bg-gray-800" />
                   <div className="flex-1 space-y-2">
                     <div className="h-2 w-3/4 bg-gray-700 rounded" />
                     <div className="h-2 w-1/2 bg-gray-800 rounded" />
                   </div>
                </div>
                <div className="flex-1 rounded border border-gray-700 mt-2 p-2 flex flex-col gap-2 relative">
                   {/* Fake tooltip */}
                   <div className="absolute -left-4 top-4 bg-blue-500 text-white text-[8px] px-2 py-1 rounded font-bold shadow-lg">
                     Weak CTA
                   </div>
                   <div className="h-2 w-full bg-gray-800 rounded" />
                   <div className="h-2 w-5/6 bg-gray-800 rounded" />
                   <div className="h-2 w-4/6 bg-gray-800 rounded" />
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-md">
            <ScanSearch className="text-white w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Precision Analysis</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Our engine dissects every pixel of your screenshots and every word of your description against top-performing benchmarks in your category.
          </p>
          <ul className="space-y-4 mt-2">
            {[
              "OCR detection for visual hierarchy issues.",
              "Sentiment analysis on recent user reviews.",
              "Keyword density and ASO score."
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-600 font-medium">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Feature Grid */}
      <section className="mt-8 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Eye className="w-6 h-6 text-gray-600" />,
            title: "Visual Audit",
            desc: "We scan your screenshots for legibility, device framing, and conversion triggers. If your 'Fold' is cluttered, we'll find it.",
            metric: "AI INSIGHT",
            bar: "w-2/3 bg-blue-500"
          },
          {
            icon: <PenLine className="w-6 h-6 text-gray-600" />,
            title: "Copy Roast",
            desc: "Boring descriptions kill installs. We analyze your tone, benefit-stacking, and call-to-actions to ensure you're speaking to humans.",
            metric: "TONE MAP",
            bar: "w-1/3 bg-black"
          },
          {
            icon: <MessageSquareQuote className="w-6 h-6 text-gray-600" />,
            title: "Review Analysis",
            desc: "We aggregate hidden pain points from your reviews that your current metadata is failing to address or counteract.",
            metric: "SENTIMENT SCORE",
            score: "8.4"
          }
        ].map((feat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 mb-6">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
              {feat.desc}
            </p>
            <div className="mt-auto pt-6 border-t border-gray-100">
              <div className="text-[10px] font-bold tracking-wider text-gray-400 mb-2 uppercase">{feat.metric}</div>
              {feat.bar && (
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div className={`h-full rounded-full ${feat.bar}`} />
                </div>
              )}
              {feat.score && (
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold leading-none">{feat.score}</span>
                  <span className="text-xs text-gray-400 font-medium mb-0.5">/10</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </section>
    </>
  );
}
