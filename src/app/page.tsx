"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import FooterCTA from "@/components/layout/FooterCTA";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import LoadingScreen from "@/components/flow/LoadingScreen";
import ResultTeaser from "@/components/flow/ResultTeaser";
import LoginCard from "@/components/auth/LoginCard";
import { UploadCloud, Sparkles, AlertCircle, FileText, Smartphone, Globe, Share2, Lock, Unlock, PlayCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../utils/firebase';
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

type AppState = 'IDLE' | 'LOADING' | 'TEASER' | 'PRICING';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [appUrl, setAppUrl] = useState('');
  const [roastData, setRoastData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Auth & Credits State
  const [session, setSession] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [showLogin, setShowLogin] = useState(false);

  React.useEffect(() => {
    const handleMagicLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        if (email) {
          try {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            // Remove the magic link query params so they don't break subsequent reloads
            window.history.replaceState({}, document.title, window.location.pathname);
            toast.success("Successfully signed in!");
          } catch (error) {
            console.error("Error signing in with magic link", error);
          }
        }
      }
    };
    handleMagicLink();

    // Clean up generic Dodo redirect parameters if present
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('payment_id')) {
      if (urlParams.get('status') === 'succeeded') {
        toast.success("Payment successful! 15 Credits added.");
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setSession(user);
      if (user) {
        // Setup real-time listener for credits
        const userRef = doc(db, 'profiles', user.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            setCredits(docSnap.data().credits || 0);
          } else {
            await setDoc(userRef, { email: user.email, credits: 0 });
            setCredits(0);
          }
        });
        setShowLogin(false);
        // Save the snapshot unsubscribe function to window so we can clean it up later if needed
        (window as any)._unsubscribeSnapshot = unsubscribeSnapshot;
      } else {
        setCredits(0);
        if ((window as any)._unsubscribeSnapshot) {
          (window as any)._unsubscribeSnapshot();
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if ((window as any)._unsubscribeSnapshot) {
        (window as any)._unsubscribeSnapshot();
      }
    };
  }, []);

  // (fetchOrCreateProfile removed as it's now handled by onSnapshot)

  const handleLogout = async () => {
    await signOut(auth);
    setSession(null);
    setCredits(0);
    window.location.reload();
  };

  const handleRoastStart = async (url: string) => {
    setAppState('LOADING');
    setError(null);
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (session) {
        const token = await session.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/roast', {
        method: 'POST',
        headers,
        body: JSON.stringify({ url })
      });

      if (res.status === 403 || res.status === 402) {
        setAppState('IDLE');
        if (session) {
          // Logged in but out of credits
          setAppState('PRICING');
        } else {
          // Not logged in and hit free limit
          setShowLogin(true);
        }
        return;
      }
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to roast');
      
      const parsedData = data.data || data;
      parsedData.screenshots = data.screenshots;
      parsedData.type = data.type;
      
      setRoastData(parsedData);
      setAppState('TEASER');
    } catch (err: any) {
      setError(err.message);
      setAppState('IDLE');
      toast.error(err.message);
    }
  };

  const handlePaymentMock = async () => {
    if (!session || !session.email) {
      setShowLogin(true);
      return;
    }
    
    try {
      const token = await session.getIdToken();
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          return_url: window.location.href
        })
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        toast.error(data.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      toast.error('Error connecting to checkout: ' + err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-black">
      <Header session={session} credits={credits} onLogout={handleLogout} onGetStarted={() => setShowLogin(true)} />

      {showLogin ? (
        <LoginCard onBack={() => setShowLogin(false)} />
      ) : appState === 'IDLE' ? (
        <>
          <Hero onRoast={handleRoastStart} />
          <Features />
          <Pricing onBuy={handlePaymentMock} isLoggedIn={!!session} />
          <FooterCTA />
        </>
      ) : appState === 'PRICING' ? (
        <div className="w-full max-w-6xl px-4 py-12 flex flex-col items-center">
          <div className="w-full flex justify-start mb-6 max-w-4xl">
            <button onClick={() => setAppState('IDLE')} className="flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors">
              <AlertCircle className="w-4 h-4" /> Go Back
            </button>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">You're out of credits!</h2>
            <p className="text-gray-500">Pick a plan below to continue roasting.</p>
          </div>
          <Pricing onBuy={handlePaymentMock} isLoggedIn={!!session} />
        </div>
      ) : appState === 'LOADING' ? (
        <LoadingScreen />
      ) : appState === 'TEASER' && roastData ? (
        <ResultTeaser 
          roastData={roastData} 
          onPaid={handlePaymentMock} 
          onBack={() => setAppState('IDLE')} 
          isPaidUser={!!session && credits > 0} 
        />
      ) : null}
      
    </main>
  );
}
