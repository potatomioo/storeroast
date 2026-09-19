import React, { useState } from 'react';
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../../utils/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function LoginCard({ onBack }: { onBack?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.replace('/');
    } catch (err: any) {
      setError(err.message || String(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center mt-12 mb-32 z-10">
      <div className="w-full flex justify-start mb-6 px-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Be Normal
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-[var(--primary-yellow)] rounded-3xl border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col">

        <div className="flex flex-col items-center text-center mb-8 pt-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black mb-2 font-handwriting">
            Sign in.
          </h2>
          <p className="text-black/80 font-bold font-handwriting text-xl mt-2">
            Let's make your conversion less embarrassing
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-bold px-4 py-3 rounded-lg mb-6 border border-red-100 text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="bg-white border-2 border-black text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
              </>
            )}
          </button>

          <p className="text-xs text-center text-black/60 font-medium mt-2">
            One-click sign in. No passwords or spam emails.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
