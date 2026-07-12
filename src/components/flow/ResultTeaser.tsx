import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Share2, ArrowLeft, Download } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

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
      const imageUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
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
        className="w-full bg-[#fdfbf7] rounded-none border-4 border-double border-gray-900 p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-8 font-serif"
      >
        <div className="flex flex-col items-center text-center mb-8 pb-8 border-b-2 border-black border-dashed">
          <div className="font-bold tracking-[0.2em] text-gray-500 uppercase text-xs mb-2">Official Document</div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-6 uppercase">Roast Report</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 italic mb-6">"{roastData.headline}"</h2>
          <div className="flex flex-col items-center bg-white border-2 border-black p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Final Grade</div>
             <div className="flex items-baseline gap-2">
               <div className="text-6xl font-black text-red-600 leading-none">{roastData.score}</div>
               <div className="text-2xl font-bold text-gray-400">/ 10</div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          {freeRoasts.map((item: any, idx: number) => (
            <div key={idx} className="relative border-l-4 border-red-500 pl-6 py-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-black text-lg uppercase tracking-wider">{item.category}</span>
                <span className="bg-black text-white px-3 py-1 rounded font-bold text-sm">{item.score}/10</span>
              </div>
              <p className="text-lg text-gray-800 mb-3 font-medium italic">"{item.roast}"</p>
              <div className="bg-red-50 p-4 border border-red-200 text-red-900 font-sans text-sm font-medium">
                <strong className="text-red-700 font-bold uppercase mr-2">Correction:</strong> {item.fix}
              </div>
            </div>
          ))}

          {isPaidUser && roastData.screenshots && roastData.screenshots.length > 0 && (
            <div className="mt-12 border-t-2 border-gray-200 pt-8">
              <h4 className="text-lg font-black uppercase tracking-widest mb-6 text-center">Visual Evidence</h4>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x justify-center">
                {roastData.screenshots.map((url: string, i: number) => (
                  <img key={i} src={url} alt={`Screenshot ${i+1}`} className="h-64 object-contain border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] snap-center bg-white p-2" crossOrigin="anonymous" />
                ))}
              </div>
            </div>
          )}

          {isPaidUser && roastData.better_student && (
             <div className="mt-8 border-2 border-blue-900 bg-blue-50 p-6 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)]">
               <div className="flex items-center justify-between mb-4 border-b border-blue-200 pb-2">
                 <h4 className="text-blue-900 font-black uppercase tracking-wider">The "Better Student"</h4>
                 <span className="bg-blue-900 text-white px-3 py-1 text-xs font-bold uppercase rounded">Class Benchmark</span>
               </div>
               <p className="text-blue-800 font-bold text-xl italic mb-2">{roastData.better_student.app_name}</p>
               <p className="text-blue-900 font-medium font-sans leading-relaxed">{roastData.better_student.roast}</p>
             </div>
          )}

          {isPaidUser && roastData.verdict && (
             <div className="mt-8 border-t-2 border-black pt-8">
               <h4 className="font-black uppercase tracking-widest mb-3 text-red-600">Principal's Remarks</h4>
               <p className="text-xl font-medium leading-relaxed">"{roastData.verdict}"</p>
             </div>
          )}
          
          {isPaidUser && roastData.fix_today && (
             <div className="mt-8 p-6 bg-black text-white shadow-[6px_6px_0px_0px_rgba(239,68,68,1)]">
               <h4 className="text-red-500 font-black uppercase tracking-widest mb-2">Mandatory Homework</h4>
               <p className="text-lg font-bold font-sans">{roastData.fix_today}</p>
             </div>
          )}

          {/* Teacher Signature */}
          <div className="mt-16 pt-8 border-t border-gray-300 flex justify-end">
            <div className="flex flex-col items-center">
               <div className="font-serif text-3xl text-gray-800 italic" style={{ fontFamily: 'var(--font-outfit), cursive' }}>StoreRoast.live</div>
               <div className="w-48 h-px bg-black mt-2 mb-1"></div>
               <div className="text-xs uppercase tracking-widest font-bold text-gray-500">Authorized Signature</div>
            </div>
          </div>
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
