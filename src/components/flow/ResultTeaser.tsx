import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Share2, ArrowLeft, ShieldCheck, Zap, Award, XCircle, ArrowDown } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

export default function ResultTeaser({ roastData, onPaid, onBack, isPaidUser }: { roastData: any, onPaid: () => void, onBack: () => void, isPaidUser: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const cert = roastData.share_certificate;
  const rep = roastData.report;

  // Fallback if data is not using the new certificate-first schema
  if (!cert || !cert.roast_pointers) {
    return (
      <div className="w-full max-w-4xl flex flex-col items-center mt-8 mb-8 z-10 px-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors mb-6 self-start">
          <ArrowLeft className="w-4 h-4" /> Roast Another
        </button>
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-8 font-medium text-sm text-center w-full max-w-lg">
          This is a legacy report. Please run a new roast to see the new minimalist format.
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    try {
      const imageUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff', // Clean white for export
      });

      const link = document.createElement('a');
      link.download = 'storeroast-certificate.png';
      link.href = imageUrl;
      link.click();

      // Only paid users get a permanent link to share. Free users just share the text.
      const urlToShare = isPaidUser ? window.location.href : 'https://storeroast.live';
      const tweet = encodeURIComponent(
        `My product just got roasted by AI 💀\n\n"${cert.main_roast_headline}"\n\nGet your certificate of failure free → ${urlToShare}\n\n#buildinpublic`
      );

      setTimeout(() => {
        window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
        setIsSharing(false);
      }, 1000);
    } catch (e) {
      console.error("Failed to generate image", e);
      setIsSharing(false);
    }
  };

  const screenshots = roastData.screenshots || [];
  const isWeb = roastData.type === 'website';

  // Filter pointers for free mode (skip visual/competitor)
  const displayPointers = isPaidUser ? cert.roast_pointers : cert.roast_pointers.slice(0, 2);
  const displayReportPointers = isPaidUser ? rep.pointers : (rep.pointers || []).slice(0, 2);

  const themeColor = cert?.brand_color || 'var(--primary-yellow)';

  return (
    <div className="w-full max-w-4xl flex flex-col items-center mt-2 mb-8 z-10 px-4 md:px-0">

      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Roast Another
        </button>

        <div className="flex items-center gap-3">
          {!isPaidUser && (
            <button onClick={onPaid} className="hidden md:flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-950 px-5 py-2.5 rounded-full text-sm font-bold hover:brightness-110 transition-all shadow-md">
              <Award className="w-4 h-4" /> Get Verified Visual Ticket
            </button>
          )}
          <button onClick={handleShare} disabled={isSharing} className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-transform hover:scale-105 disabled:opacity-50 shadow-md">
            {isSharing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Share2 className="w-4 h-4" />}
            {isSharing ? 'Generating...' : 'Share on X'}
          </button>
        </div>
      </div>

      {/* =========================================
          THE NEW STICKY NOTE / TICKET CERTIFICATE
          ========================================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-center mb-16 relative"
      >
        <div
          ref={cardRef}
        >

          {/* THE SINGLE WIDE STICKY NOTE */}
          <div
            className="relative w-full max-w-2xl px-8 py-12 md:px-16 md:py-16 z-20 flex flex-col rounded-t-sm pb-16"
            style={{
              backgroundImage: `radial-gradient(circle at 15px 100%, transparent 10px, ${themeColor} 10.5px)`,
              backgroundSize: "30px 100%",
              backgroundRepeat: "repeat-x",
              backgroundColor: "transparent",
              boxShadow: "0px -10px 20px rgba(0,0,0,0.2)"
            }}
          >
            {/* The Tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-10 bg-white/40 backdrop-blur-sm -rotate-1 shadow-sm z-30" style={{ clipPath: 'polygon(5% 0%, 95% 2%, 100% 100%, 0% 98%)' }} />

            {/* Coffee Stain Overlay (Subtle Handcrafted Detail) */}
            <div className="absolute top-12 -right-8 w-40 h-40 opacity-10 mix-blend-multiply pointer-events-none rotate-45 rounded-full border-[6px] border-dashed border-amber-900 z-10" />

            {/* Hand-drawn Star */}
            <svg className="absolute top-8 left-8 w-8 h-8 opacity-40 -rotate-12 pointer-events-none z-10" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" />
            </svg>

            {/* Ticket Header */}
            <div className="flex justify-between items-start mb-8 md:mb-10 relative z-20">
              <div className="text-sm font-bold text-black opacity-80">StoreRoast</div>

              {/* Verified Stamp */}
              {isPaidUser && cert.verified_badge && (
                <div className="relative">
                  <div className="absolute -top-2 -right-2 w-full h-full border-2 border-red-600/30 rotate-6 rounded-sm" />
                  <div className="rotate-3 border-2 border-red-600 text-red-600 px-2 py-0.5 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-sm opacity-90 mix-blend-multiply shadow-sm bg-red-600/5">
                    VERIFIED ROAST
                  </div>
                </div>
              )}
            </div>

            {/* Embedded Screenshots (Paid Only) at the top */}
            {isPaidUser && screenshots.length > 0 && (
              <div className="w-full flex flex-col items-center mb-8 relative z-20">
                {isWeb ? (
                  <div className="w-full flex justify-center items-center">
                    <div
                      className="w-full aspect-[16/9] rounded-xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white z-20"
                      style={{ backgroundImage: `url('${screenshots[0]}')`, backgroundSize: 'cover', backgroundPosition: 'top' }}
                    />
                  </div>
                ) : (
                  <div className="w-full flex justify-center gap-4 md:gap-6 z-20">
                    {screenshots.slice(0, 3).map((src: string, i: number) => (
                      <div
                        key={i}
                        className="flex-1 aspect-[9/16] rounded-xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
                        style={{
                          backgroundImage: `url('${src}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'top'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* App Name with Marker Underline */}
            <div className="relative inline-block mb-8 self-start z-20">
              <h1 className={`font-handwriting font-bold tracking-tighter text-black leading-[0.9] relative z-10 ${isPaidUser ? 'text-5xl md:text-6xl' : 'text-6xl md:text-8xl'}`}>
                {cert.product_name}
              </h1>
              {/* Handwritten Underline */}
              <svg className="absolute -bottom-2 left-0 w-full h-4 text-black opacity-80 z-0" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M 5,10 Q 30,5 50,15 T 95,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            {/* Main Savage Headline with Hand-drawn Arrow */}
            <div className={`w-full relative z-20 ${isPaidUser ? 'mb-6' : 'mb-8'}`}>
              {/* Handwritten "Ouch" Annotation */}
              <div className="absolute -top-8 -right-4 md:-right-8 text-red-600 font-handwriting font-bold text-xl rotate-12 flex flex-col items-center">
                <span>Oof.</span>
                <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 4v16m0 0l-4-4m4 4l4-4" />
                </svg>
              </div>

              <p className={`${isPaidUser ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'} font-handwriting text-red-600 leading-tight font-bold italic`}>
                "{cert.main_roast_headline}"
              </p>
              <div className="h-0.5 w-full bg-black/10 mt-6 rounded-full" />
            </div>

            {/* Pointers Section */}
            <div className="mb-4 relative z-20">
              <div className="space-y-3">
                {displayPointers.map((pointer: any, i: number) => {
                  const text = typeof pointer === 'string' ? pointer : pointer.text;
                  const highlight = typeof pointer === 'string' ? null : pointer.highlight;

                  const isCompetitor = isPaidUser && i === 2; // The 3rd pointer is the competitor pointer in paid mode

                  return (
                    <div key={i} className="flex items-start gap-3 relative">
                      <span className={`font-handwriting ${isPaidUser ? 'text-base md:text-lg' : 'text-lg md:text-xl'} text-black font-black shrink-0 mt-0.5`}>x</span>
                      <span className={`font-handwriting ${isPaidUser ? 'text-base md:text-lg' : 'text-lg md:text-xl'} text-gray-900 leading-snug`}>
                        {highlight && text.includes(highlight) ? (
                          <>
                            {text.split(highlight)[0]}
                            {isCompetitor ? (
                              <span className="relative inline-block mx-1">
                                {/* Hand-drawn Red Circle around Competitor */}
                                <svg className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] text-red-600 opacity-90 z-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                  <ellipse cx="50" cy="50" rx="45" ry="35" transform="rotate(-3 50 50)" />
                                </svg>
                                <span className="relative z-10 font-bold px-1 uppercase tracking-tight text-red-700">{highlight}</span>
                              </span>
                            ) : (
                              <span className="relative inline-block mx-1">
                                {/* Yellow Highlighter Mark */}
                                <span className="absolute inset-0 bg-yellow-300 mix-blend-multiply rounded-sm rotate-1 scale-105" />
                                <span className="relative z-10 font-bold px-1 border-b-2 border-black/20">{highlight}</span>
                              </span>
                            )}
                            {text.split(highlight)[1]}
                          </>
                        ) : (
                          text
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smiley doodle */}
            <div className="absolute bottom-6 right-8 opacity-40 mt-auto pointer-events-none z-10">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round">
                <circle cx="50" cy="50" r="40" />
                <path d="M35 40 v10 M65 40 v10" />
                <path d="M35 65 Q 50 80 65 65" />
              </svg>
            </div>
          </div>

        </div>
      </motion.div>


      {/* =========================================
          DIVIDER
          ========================================= */}
      <div className="w-full flex flex-col items-center justify-center mb-16 opacity-50">
        <ArrowDown className="w-6 h-6 text-gray-400 mb-4 animate-bounce" />
        <div className="text-sm font-bold tracking-widest uppercase text-gray-500">View Detailed Breakdown</div>
      </div>

      {/* =========================================
          MINIMALIST REPORT SECTION (2-Line Explanations)
          ========================================= */}
      <div className="w-full max-w-3xl mb-8">
        <div className="space-y-6 mb-12">
          {displayReportPointers && displayReportPointers.map((pointer: any, i: number) => (
            <div key={i} className="bg-white border-2 border-black p-6 md:p-8 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col">
              <div className="text-sm font-black uppercase tracking-widest text-black/40 mb-3 font-handwriting">{pointer.title}</div>
              <p className="text-lg md:text-xl font-bold text-black mb-6 leading-relaxed font-handwriting">
                "{pointer.roast}"
              </p>
              <div className="flex items-center gap-3 bg-[var(--primary-yellow)]/20 px-5 py-4 rounded-xl border-2 border-black mt-auto">
                <Zap className="w-5 h-5 text-black shrink-0" />
                <span className="text-base font-bold text-black">Fix: {pointer.fix}</span>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================
            FREE FLOW PAYWALL
            ========================================= */}
        {!isPaidUser && (
          <div className="relative mt-8">
            <div className="bg-white border-4 border-black rounded-3xl p-10 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-20 text-center md:text-left flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <Lock className="w-6 h-6 text-black" />
                  <h4 className="text-3xl font-black text-black uppercase tracking-tight font-handwriting">Unlock Deep Roast</h4>
                </div>
                <p className="text-black/70 font-bold mb-8 text-lg font-handwriting">You've only seen the tip of the iceberg. Unlock the verified ticket and full pointer breakdown.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 md:mb-0">
                  {['Verified Social Badge', 'Competitor Benchmark Pointer', 'UI/UX Visual Roast', 'More Fixes'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-black text-[var(--primary-yellow)] flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-sm font-bold text-black font-handwriting">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-64 shrink-0">
                <button onClick={onPaid} className="w-full bg-black text-white py-5 px-6 rounded-2xl font-bold text-lg hover:bg-gray-800 active:translate-y-1 active:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
                  <span>Unlock Now</span>
                  <span className="text-xs font-bold text-white/50 mt-1">1 Credit</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
