"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import FooterCTA from "@/components/layout/FooterCTA";
import LoadingScreen from "@/components/flow/LoadingScreen";
import ResultTeaser from "@/components/flow/ResultTeaser";
import LoginCard from "@/components/auth/LoginCard";
import { UploadCloud, Sparkles, AlertCircle, FileText, Smartphone, Globe, Share2, Lock, Unlock, PlayCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../utils/firebase';
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

type AppState = 'IDLE' | 'LOADING' | 'RESULT' | 'PRICING' | 'LOGIN';

export default function Home() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [appUrl, setAppUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [freeRoastData, setFreeRoastData] = useState<any>(null);
  
  // Auth & Credits State
  const [session, setSession] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
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
            window.location.replace('/');
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
        toast.success("Payment successful! Credits added.");
      } else {
        toast.error("Payment failed or was cancelled.");
      }
      
      // Implement a history trap to prevent going back to checkout
      window.history.replaceState({ appState: 'IDLE', depth: 0, trap: true }, document.title, window.location.pathname);
      window.history.pushState({ appState: 'IDLE', depth: 0 }, document.title, window.location.pathname);
      setAppState('IDLE');
    }

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.trap) {
        window.history.forward();
        return;
      }
      if (e.state && e.state.appState) {
        setAppState(e.state.appState);
      } else {
        setAppState('IDLE');
      }
    };
    window.addEventListener('popstate', handlePopState);

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
        setAppState((prev) => prev === 'LOGIN' ? 'IDLE' : prev);
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
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const updateState = (newState: AppState) => {
    if (appState === newState || window.history.state?.appState === newState) return;
    
    setAppState(newState);
    
    const currentDepth = window.history.state?.depth || 0;
    const nextDepth = currentDepth + 1;

    if (newState === 'RESULT') {
      window.history.pushState({ appState: 'RESULT', depth: nextDepth }, '', '#result');
    } else if (newState === 'PRICING') {
      window.history.pushState({ appState: 'PRICING', depth: nextDepth }, '', '#pricing');
    } else if (newState === 'LOGIN') {
      window.history.pushState({ appState: 'LOGIN', depth: nextDepth }, '', '#login');
    } else if (newState === 'IDLE') {
      window.history.replaceState({ appState: 'IDLE', depth: 0 }, '', window.location.pathname);
    }
  };

  // (fetchOrCreateProfile removed as it's now handled by onSnapshot)

  const handleLogout = async () => {
    await signOut(auth);
    setSession(null);
    setCredits(0);
    window.location.reload();
  };

  const handlePayment = async () => {
    if (!session || !session.email) {
      updateState('LOGIN');
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
          return_url: window.location.origin
        })
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.replace(data.checkout_url);
      } else {
        toast.error(data.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      toast.error('Error connecting to checkout: ' + err.message);
    }
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

      if (res.status === 403) {
        setAppState('IDLE');
        if (session) {
          // Logged in but out of credits
          router.push('/pricing');
        } else {
          // Not logged in and hit free limit
          updateState('LOGIN');
        }
        return;
      }
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to roast');
      
      if (data.reportId) {
        router.push(`/report/${data.reportId}`);
      } else {
        setFreeRoastData(data.data);
        updateState('RESULT');
      }
    } catch (err: any) {
      setError(err.message);
      updateState('IDLE');
      toast.error(err.message);
    }
  };

  const handleHomeClick = () => {
    const currentDepth = window.history.state?.depth || 0;
    if (currentDepth > 0) {
      window.history.go(-currentDepth);
    } else {
      updateState('IDLE');
    }
    setAppState('IDLE');
    window.scrollTo(0,0);
  };

  const handlePricingClick = () => {
    updateState('PRICING');
    window.scrollTo(0,0);
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-black relative">
      <div className="absolute top-0 w-full flex justify-center z-50">
        <Header session={session} credits={credits} onLogout={handleLogout} onGetStarted={() => updateState('LOGIN')} onHome={handleHomeClick} onPricing={handlePricingClick} />
      </div>

      <div className="w-full flex-1 flex flex-col items-center">
        {appState === 'LOGIN' ? (
          <div className="w-full pt-32 flex justify-center">
            <LoginCard onBack={() => {
              if ((window.history.state?.depth || 0) > 0) {
                window.history.back();
              } else {
                updateState('IDLE');
              }
            }} />
          </div>
        ) : appState === 'IDLE' ? (
          <div className="w-full">
            <Hero onRoast={handleRoastStart} />
            <Features />
          </div>
        ) : appState === 'LOADING' ? (
          <div className="w-full pt-32">
            <LoadingScreen />
          </div>
        ) : appState === 'RESULT' && freeRoastData ? (
          <div className="w-full pt-32 flex justify-center">
            <ResultTeaser 
              roastData={freeRoastData} 
              onPaid={() => {
                window.scrollTo(0,0);
                updateState('PRICING');
              }} 
              onBack={() => {
                if ((window.history.state?.depth || 0) > 0) window.history.back();
                else updateState('IDLE');
              }} 
              isPaidUser={false} 
            />
          </div>
        ) : appState === 'PRICING' ? (
          <div className="w-full pt-32 pb-32 flex justify-center">
            <Pricing onBuy={handlePayment} isLoggedIn={!!session} onBack={() => {
              if ((window.history.state?.depth || 0) > 0) window.history.back();
              else updateState(freeRoastData ? 'RESULT' : 'IDLE');
            }} />
          </div>
        ) : null}
      </div>
      
      <FooterCTA onHome={handleHomeClick} onPricing={handlePricingClick} />
    </main>
  );
}
