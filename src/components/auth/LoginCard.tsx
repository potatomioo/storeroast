import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, Sparkles, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../../utils/firebase';
import { sendSignInLinkToEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function LoginCard({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address first.');
      return;
    }
    setError('');
    setIsLoading(true);

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain must be in the authorized domains list in Firebase Console.
      url: window.location.origin,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.reload();
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
            {step === 'EMAIL' ? 'Sign in.' : 'Check your inbox'}
          </h2>
          <p className="text-black/80 font-bold font-handwriting text-xl mt-2">
            {step === 'EMAIL'
              ? "Let's make your conversion less embarrassing"
              : `We sent a magic link to ${email}. Let's see if you can follow basic instructions.`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-bold px-4 py-3 rounded-lg mb-6 border border-red-100 text-center">
            {error}
          </div>
        )}

        {step === 'EMAIL' ? (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="bg-white border-2 border-black text-black px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 my-4 text-lg text-black font-bold font-handwriting">
              <div className="flex-1 h-0.5 bg-black"></div>
              Or don't use Google
              <div className="flex-1 h-0.5 bg-black"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="flex flex-col gap-4" noValidate>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="hello@fmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl px-12 py-3.5 font-bold text-black outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder-gray-400"
                />
              </div>
              <button
                disabled={isLoading}
                className="bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Send Me
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-black" />
            <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-bold text-lg leading-relaxed font-handwriting">
              We just sent a secure link to {email}.<br /><br />
              <span className="text-red-600 font-black">Important:</span> Click the link <strong className="underline">on this device</strong> to sign in.
            </div>

            <button
              type="button"
              onClick={() => setStep('EMAIL')}
              className="mt-2 text-sm text-black/70 font-bold hover:text-black transition-colors font-handwriting text-lg"
            >
              Wait, I messed up my email...
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
