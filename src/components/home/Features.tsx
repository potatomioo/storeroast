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
        className="mt-32 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-50/50 rounded-3xl p-8 lg:p-16 border border-gray-100"
      >
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          <h2 className="text-3xl font-bold tracking-tight">Wall of Flame</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Every week, we incinerate hundreds of mediocre listings. Join the ranks of developers who survived the roast and doubled their installs.
          </p>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-gray-900">500+ roasted this week</span>
              <span className="text-blue-500 tracking-widest uppercase">Destruction Meter</span>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-full w-3/4 bg-gradient-to-r from-fuchsia-500 to-blue-500 rounded-full" />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Soft Launch</span>
              <span>Total Annihilation</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl font-black text-gray-900 mb-1">124%</div>
              <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Avg. CVR Increase</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl font-black text-gray-900 mb-1">15k+</div>
              <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Total Apps Roasted</div>
            </div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 h-full min-h-[400px] flex items-center justify-center">
           {/* Testimonial 1 */}
           <div className="absolute top-0 right-0 bg-white p-6 rounded-2xl shadow-xl w-[90%] border border-gray-100 z-10 rotate-2 hover:rotate-0 transition-transform">
             <p className="text-gray-600 font-medium italic mb-6">
               "They told me my main screenshot looked like it was from 2008. Brutal, but they were right. Fixed it, conversions up 40%."
             </p>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">DM</div>
               <span className="text-sm font-bold text-gray-900">@dev_marco</span>
             </div>
           </div>

           {/* Survivor Badge */}
           <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-black text-white p-6 rounded-2xl shadow-2xl z-20 -rotate-3 hover:rotate-0 transition-transform">
             <div className="text-2xl font-black italic tracking-tight mb-1">SURVIVOR</div>
             <div className="text-xs text-gray-400 font-medium">App Store Rank #4 (FinTech)</div>
           </div>

           {/* Testimonial 2 */}
           <div className="absolute bottom-0 left-8 bg-white p-6 rounded-2xl shadow-xl w-[85%] border border-gray-100 z-10 -rotate-2 hover:rotate-0 transition-transform">
             <div className="flex text-yellow-400 mb-3 text-sm">
               ★★★★★
             </div>
             <p className="text-gray-900 font-bold mb-1">"The only ASO tool I trust."</p>
             <p className="text-gray-500 text-sm font-medium">No fluff, just pure data-driven destruction.</p>
           </div>
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
