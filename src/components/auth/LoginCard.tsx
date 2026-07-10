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

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-white rounded-3xl border-2 border-gray-900 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'EMAIL' ? 'Create an account' : 'Check your email'}
          </h2>
          <p className="text-gray-500 font-medium">
            {step === 'EMAIL'
              ? 'Sign in to unlock full roasts and buy credits. No password required.'
              : `We sent a magic link to ${email}`}
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
              className="bg-white border-2 border-gray-200 text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            
            <div className="flex items-center gap-4 my-2 text-sm text-gray-400 font-medium">
              <div className="flex-1 h-px bg-gray-200"></div>
              Or with email
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <form onSubmit={handleSendLink} className="flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="developer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-12 py-3.5 font-medium text-gray-900 outline-none focus:border-black transition-colors"
                />
              </div>
              <button
                disabled={isLoading}
                className="bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Send Magic Link
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 text-gray-700 font-medium text-lg leading-relaxed">
              We just sent a secure link to <strong className="text-black">{email}</strong>.<br/><br/>
              Click the link in the email to instantly sign in. You can safely close this window.
            </div>
            
            <button
              type="button"
              onClick={() => setStep('EMAIL')}
              className="mt-2 text-sm text-gray-500 font-medium hover:text-black transition-colors"
            >
              Wait, I need to use a different email
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
