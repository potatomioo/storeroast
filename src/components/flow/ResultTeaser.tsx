import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Share2, ArrowLeft, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function ResultTeaser({ roastData, onPaid, onBack, isPaidUser }: { roastData: any, onPaid: () => void, onBack: () => void, isPaidUser: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const roasts = roastData.roasts || [];
  const freeRoasts = isPaidUser ? roasts : roasts.slice(0, 2);
  const lockedRoasts = isPaidUser ? [] : (roasts.length > 2 ? roasts.slice(2) : []);

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imageUrl = canvas.toDataURL('image/png');
      
      // Auto download
      const link = document.createElement('a');
      link.download = 'app-roast.png';
      link.href = imageUrl;
      link.click();
      
      // Open X with pre-filled text
      const tweet = encodeURIComponent(
        `AI just roasted my app listing 💀\n\nScore: ${roastData.score}/10\n\n"${roastData.headline}"\n\nGet yours roasted free → storeroast.live\n\n#buildinpublic #indiedev`
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

  return (
    <div className="w-full max-w-4xl flex flex-col items-center mt-8 mb-32 z-10">
      
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Roast Another App
        </button>
        <button onClick={handleShare} disabled={isSharing} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
          {isSharing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Share2 className="w-4 h-4" />}
          {isSharing ? 'Generating...' : 'Share on X'}
        </button>
      </div>

      {/* The Report Card (This Div gets captured by html2canvas) */}
      <motion.div 
        ref={cardRef} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full bg-white rounded-3xl border-2 border-gray-900 p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8"
      >
        <div className="flex flex-col items-center text-center mb-10 pb-10 border-b-2 border-gray-100">
          <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6">
            STOREROAST.LIVE
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">"{roastData.headline}"</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="text-5xl font-black text-red-500">{roastData.score}</div>
            <div className="text-xl text-gray-400 font-bold mt-2">/ 10</div>
          </div>
        </div>

        <div className="space-y-10">
          {freeRoasts.map((item: any, idx: number) => (
            <div key={idx} className="relative">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-[11px] font-black tracking-widest uppercase">
                  {item.category} • {item.score}/10
                </span>
              </div>
              <p className="text-lg text-gray-900 mb-3 font-medium leading-relaxed">"{item.roast}"</p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-600 text-sm">
                <strong className="text-black">Fix it:</strong> {item.fix}
              </div>
            </div>
          ))}

          {isPaidUser && roastData.screenshots && roastData.screenshots.length > 0 && (
            <div className="mt-8 border-t-2 border-gray-100 pt-8">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Screenshots Analyzed</h4>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x justify-center">
                {roastData.screenshots.map((url: string, i: number) => (
                  <img key={i} src={url} alt={`Screenshot ${i+1}`} className="h-64 object-contain rounded-xl border border-gray-200 shadow-sm snap-center" crossOrigin="anonymous" />
                ))}
              </div>
            </div>
          )}

          {isPaidUser && roastData.verdict && (
             <div className="mt-12 p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
               <h4 className="text-red-800 font-bold mb-2 uppercase tracking-wider text-sm">Final Verdict</h4>
               <p className="text-red-900 font-medium">{roastData.verdict}</p>
             </div>
          )}
          
          {isPaidUser && roastData.fix_today && (
             <div className="mt-4 p-6 bg-black text-white rounded-2xl">
               <h4 className="text-gray-400 font-bold mb-2 uppercase tracking-wider text-sm">The ONE Fix Today</h4>
               <p className="text-white font-medium">{roastData.fix_today}</p>
             </div>
          )}
        </div>
      </motion.div>

      {/* Blurred / Locked Section Logic */}
      {!isPaidUser && lockedRoasts.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="w-full relative overflow-hidden rounded-3xl mt-4">
          <div className="absolute inset-0 z-10 backdrop-blur-md bg-white/70 flex flex-col items-center justify-center border-2 border-gray-200 rounded-3xl">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-md border border-gray-100">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Unlock the rest of the roast
              </h3>
              <p className="text-gray-500 mb-8 font-medium">Get the remaining roasts, the brutal final verdict, and the actionable fix plan.</p>
              <button 
                onClick={onPaid}
                className="bg-black text-white px-8 py-3.5 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg w-full transform hover:scale-105"
              >
                Unlock Report Card — 1 Credit
              </button>
            </div>
          </div>

          <div className="w-full bg-gray-50 rounded-3xl border-2 border-gray-200 p-8 md:p-12 blur-md opacity-40 select-none">
            <div className="space-y-12">
              <div className="h-20 bg-gray-300 rounded-lg w-full"></div>
              <div className="h-20 bg-gray-300 rounded-lg w-full"></div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
